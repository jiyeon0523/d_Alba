import { useEffect, useRef, useState, type DragEvent as ReactDragEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Header, Hero, ProductCard, Tabs, Picture, Asset, Pill } from './components';
import { concerns, best, routines, collections, first, type Product } from './data';

type Overlay = { title: string; kind?: 'cart' | 'search' | 'quiz'; product?: Product; body?: string };
const quizQuestions = ['평소 피부 타입은 어떤가요?', '원하는 선크림의 마무리감은?', '주로 어디에서 시간을 보내나요?'];
const quizOptions = [['건성', '지성·복합성', '민감성'], ['촉촉한 수분감', '자연스러운 톤업', '순하고 편안한 사용감'], ['실내 활동', '일상적인 외출', '야외 활동']];

function Dialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    function keys(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', keys);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', keys); previous?.focus(); };
  }, [close]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="max-h-[85dvh] w-full max-w-xl overflow-y-auto bg-white p-6 outline-none md:p-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-bold">{title}</h2>
          <button onClick={close} aria-label="닫기" className="min-h-11 min-w-11 text-3xl focus-visible:ring-2">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function useDragScroll() {
  const drag = useRef<{ element: HTMLDivElement; pointerId: number; startX: number; scrollLeft: number; lastX: number; lastTime: number; startTime: number; velocity: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const inertiaFrame = useRef<number | null>(null);
  const snapOverride = useRef<{ element: HTMLDivElement; value: string } | null>(null);
  function restoreSnap() {
    if (!snapOverride.current) return;
    snapOverride.current.element.style.scrollSnapType = snapOverride.current.value;
    snapOverride.current = null;
  }
  useEffect(() => {
    function move(event: PointerEvent) {
      const current = drag.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const distance = event.clientX - current.startX;
      const elapsed = event.timeStamp - current.lastTime;
      if (elapsed > 0) current.velocity = -(event.clientX - current.lastX) / elapsed;
      current.lastX = event.clientX;
      current.lastTime = event.timeStamp;
      if (Math.abs(distance) > 5) current.moved = true;
      if (!current.moved) return;
      current.element.scrollLeft = current.scrollLeft - distance;
      event.preventDefault();
    }
    function finish(event: PointerEvent) {
      const current = drag.current;
      if (!current || event.pointerId !== current.pointerId) return;
      suppressClick.current = current.moved;
      drag.current = null;
      if (!current.moved) { restoreSnap(); return; }
      const duration = Math.max(1, event.timeStamp - current.startTime);
      const averageVelocity = -(event.clientX - current.startX) / duration;
      let velocity = (current.velocity * 0.65 + averageVelocity * 0.35) * Math.exp(-Math.max(0, event.timeStamp - current.lastTime) / 100);
      velocity = Math.max(-1.8, Math.min(1.8, velocity));
      if (Math.abs(velocity) < 0.04) { restoreSnap(); return; }
      let previous = performance.now();
      function glide(now: number) {
        const elapsed = Math.min(now - previous, 32);
        const maxScroll = current.element.scrollWidth - current.element.clientWidth;
        current.element.scrollLeft = Math.max(0, Math.min(maxScroll, current.element.scrollLeft + velocity * elapsed));
        velocity *= Math.pow(0.87, elapsed / 16);
        previous = now;
        const atEdge = (current.element.scrollLeft <= 0 && velocity < 0) || (current.element.scrollLeft >= maxScroll && velocity > 0);
        if (!atEdge && Math.abs(velocity) >= 0.04) inertiaFrame.current = requestAnimationFrame(glide);
        else { inertiaFrame.current = null; restoreSnap(); }
      }
      inertiaFrame.current = requestAnimationFrame(glide);
    }
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      if (inertiaFrame.current !== null) cancelAnimationFrame(inertiaFrame.current);
      restoreSnap();
    };
  }, []);
  return {
    onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || event.currentTarget.scrollWidth <= event.currentTarget.clientWidth) return;
      if (inertiaFrame.current !== null) cancelAnimationFrame(inertiaFrame.current);
      inertiaFrame.current = null;
      restoreSnap();
      suppressClick.current = false;
      snapOverride.current = { element: event.currentTarget, value: event.currentTarget.style.scrollSnapType };
      event.currentTarget.style.scrollSnapType = 'none';
      drag.current = { element: event.currentTarget, pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, lastX: event.clientX, lastTime: event.timeStamp, startTime: event.timeStamp, velocity: 0, moved: false };
    },
    onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
    onDragStart(event: ReactDragEvent<HTMLDivElement>) {
      event.preventDefault();
    },
  };
}

function ProductDetailPage({ product, add }: { product: Product; add: (products: Product[]) => void }) {
  return (
    <main id="main" className="bg-white">
      <section className="mx-auto max-w-[1080px] px-5 pt-8 pb-6 md:px-10 md:pt-12">
        <p className="mb-6 text-sm text-[#817b70]">홈 <span className="px-2">/</span> 제품 <span className="px-2">/</span> 미스트</p>
        <div className="flex flex-col gap-6 border-y border-[#e6e0d5] py-6 md:flex-row md:items-center md:gap-8">
          <Picture file={product.image} alt={product.name} className="mx-auto aspect-square w-full max-w-[180px] object-contain md:mx-0" />
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-[#a2720c]">d’Alba SIGNATURE</p>
            <h1 className="mt-2 text-xl font-bold md:text-2xl">{product.name}</h1>
            <p className="mt-3 text-sm text-[#5e5a52]">{product.size} · {product.tags}</p>
            <p className="mt-5 text-2xl font-bold">{product.price.toLocaleString()}원</p>
            <button onClick={() => add([product])} className="mt-5 min-h-12 w-full bg-[#242321] px-8 font-bold text-white hover:bg-[#4a463d] md:w-auto">장바구니 담기</button>
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-[860px]">
        <Picture file="product detail.png" alt={`${product.name} 제품 상세 정보`} className="block h-auto w-full" />
      </div>
    </main>
  );
}

export default function App() {
  const [concern, setConcern] = useState(0);
  const [routine, setRoutine] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [query, setQuery] = useState('');
  const [quiz, setQuiz] = useState<string[]>([]);
  const [quizStep, setQuizStep] = useState(0);
  const [cart, setCart] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem('dalba-preview-cart') || '[]'); } catch { return []; }
  });
  const [notice, setNotice] = useState('');
  const [detailPage, setDetailPage] = useState(() => window.location.pathname.endsWith('/products/first-spray-serum'));
  const bestRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const quizPanelRef = useRef<HTMLDivElement>(null);
  const concernDrag = useDragScroll();
  const collectionDrag = useDragScroll();
  const bestDrag = useDragScroll();
  const routineDrag = useDragScroll();
  const allProducts = [...concerns.flatMap(c => c.products), ...best, ...routines.flatMap(r => r.products)];
  const searchResults = allProducts.filter((p, i, a) => p.name.includes(query.trim()) && a.findIndex(x => x.name === p.name) === i);
  useEffect(() => { try { localStorage.setItem('dalba-preview-cart', JSON.stringify(cart)); } catch { /* Browser storage may be disabled. */ } }, [cart]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => {
    if (overlay?.kind !== 'quiz') return;
    quizPanelRef.current?.parentElement?.scrollTo({ top: 0 });
  }, [overlay?.kind, quizStep]);
  useEffect(() => {
    function syncPage() { setDetailPage(window.location.pathname.endsWith('/products/first-spray-serum')); }
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);
  function add(products: Product[]) { setCart(c => [...c, ...products]); setNotice(`${products.length}개 제품을 담았습니다. (이 브라우저에만 저장)`); }
  function openDetailPage() {
    setOverlay(null);
    setDetailPage(true);
    if (!window.location.pathname.endsWith('/products/first-spray-serum')) {
      window.history.pushState({}, '', `${import.meta.env.BASE_URL}products/first-spray-serum`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goHome() {
    setDetailPage(false);
    if (window.location.pathname.endsWith('/products/first-spray-serum')) {
      window.history.pushState({}, '', import.meta.env.BASE_URL);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openProduct() {
    openDetailPage();
  }
  function chooseQuizAnswer(answer: string) {
    setQuiz(answers => {
      const next = [...answers];
      next[quizStep] = answer;
      return next;
    });
    setQuizStep(step => step + 1);
  }
  function previousQuizStep() {
    setQuizStep(step => Math.max(0, step - 1));
  }
  function resetQuiz() {
    setQuiz([]);
    setQuizStep(0);
  }
  function navigate(label: string) {
    setOverlay(null);
    if (['미스트', '세럼·토너·앰플', '화이트 트러플'].includes(label)) { openDetailPage(); return; }
    const index = ['항산화', '비건', '수분·보습', '저자극·진정'].findIndex(x => label.includes(x));
    let target = 'concern';
    if (index >= 0) { target = 'collections'; }
    else if (label === '홈 트라이') target = 'home-try';
    else if (label === '루틴 추천' || label === '케어 가이드') target = 'routine';
    else if (label === '나의 선케어 찾기') { resetQuiz(); setOverlay({ title: '내 피부에 맞는 선크림 진단하기', kind: 'quiz' }); return; }
    else if (label === '베스트' || label === '제품' || label === '전체보기') target = 'best';
    else if (label.includes('선크림')) { setConcern(3); target = 'concern'; }
    else if (['달바 스토리', '화이트 트러플', '제품검증과 비건', '리뷰', '공지사항', '이벤트', '회원가입', '마이페이지', '관심상품'].includes(label)) {
      setOverlay({ title: label, body: '현재 메인 페이지 인터랙션 미리보기입니다. 해당 페이지의 시안과 연결 주소는 제공되지 않았습니다.' }); return;
    } else if (label === '고객센터') target = 'footer';
    else { setQuery(label); setOverlay({ title: '제품 검색', kind: 'search' }); return; }
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  }
  function chooseConcern(i: number) { setConcern(i); gridRef.current?.scrollTo({ left: 0 }); }
  const close = useRef(() => setOverlay(null)).current;
  const total = cart.reduce((s, p) => s + p.price, 0);
  return (
    <div className="min-h-dvh overflow-x-hidden bg-white font-sans text-[#242321] [&_button]:cursor-pointer [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:ring-2 [&_a]:focus-visible:ring-2">
      <Header navigate={navigate} home={goHome} detail={openDetailPage} search={() => { setQuery(''); setOverlay({ title: '제품 검색', kind: 'search' }); }} cart={() => setOverlay({ title: '장바구니', kind: 'cart' })} count={cart.length} />
      {detailPage ? <ProductDetailPage product={first} add={add} /> : <main id="main">
        <Hero onAction={i => { if (i === 0) { chooseConcern(1); navigate('전체보기'); } else if (i === 1) navigate('비거너리'); else navigate('디바이스'); }} />
        <section id="concern" className="scroll-mt-8 px-5 pt-16 pb-12 md:px-10 md:pt-20 lg:pt-20">
          <h2 className="text-center text-2xl font-bold leading-[44px] md:text-[32px]">어떤 피부 고민이 있으세요?</h2>
          <p className="mt-4 text-center text-sm text-[#5e5a52] md:text-base">고민을 선택하면 추천 제품을 빠르게 찾아볼 수 있어요.</p>
          <Tabs labels={concerns.map(c => c.label)} active={concern} onChange={chooseConcern} label="피부 고민" textClassName="text-lg" />
          <div ref={gridRef} {...concernDrag} role="tabpanel" aria-label={`${concerns[concern].label} 추천 제품`} className="mx-auto mt-8 flex max-w-[1580px] cursor-grab snap-x snap-proximity gap-5 overflow-x-auto pb-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-6">
            {concerns[concern].products.map(p => <ProductCard key={p.image} product={p} centerPrice imageHoverBg add={add} open={openProduct} />)}
          </div>
          <div className="mx-auto mt-16 flex max-w-[1280px] flex-col items-center gap-4 bg-[#e7bb38] px-5 py-6 md:flex-row md:flex-nowrap md:px-7">
            <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
              <Asset file="2dbf4.svg" alt="" /><span className="absolute text-[22px] font-bold text-[#715820]">?</span>
            </div>
            <div className="w-full min-w-0 text-center md:flex-1 md:text-left">
              <h3 className="text-base font-bold md:text-[22px]">내 피부에 맞는 선크림 진단하기</h3>
              <p className="mt-2 text-sm text-[#514a38]">3~4문항 · 약 1분 · 결과에서 제품까지 추천</p>
            </div>
            <div className="flex w-full justify-center md:w-auto md:justify-start">
              <Pill light onClick={() => navigate('나의 선케어 찾기')}>진단 시작하기</Pill>
            </div>
          </div>
        </section>
        <section id="collections" className="scroll-mt-8 pt-8 md:pt-12">
          <h2 className="mb-12 text-center text-2xl font-bold md:mb-[80px] md:text-[32px]">나에게 맞는 컬렉션 찾기</h2>
          <div {...collectionDrag} className="grid grid-cols-2 gap-2 overflow-hidden min-[48rem]:gap-4 lg:flex lg:cursor-grab lg:snap-x lg:snap-proximity lg:gap-0 lg:overflow-x-auto lg:overflow-y-hidden lg:active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onMouseLeave={() => setHover(null)}>
            {collections.map((c, i) => (
              <a key={c.image} href="#concern" onClick={() => chooseConcern([0, 2, 1, 2][i])} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                className={`relative h-[300px] min-w-0 snap-start overflow-hidden transition-[flex-basis] duration-500 motion-reduce:transition-none min-[48rem]:h-[420px] lg:h-[min(41.667vw,800px)] lg:shrink-0 ${hover === null ? 'lg:basis-1/4' : hover === i ? 'lg:basis-2/5' : 'lg:basis-1/5'}`}>
                <Picture file={c.image} alt={c.description} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-b from-transparent via-black/60 to-black/80" />
                <div className="absolute inset-x-0 bottom-4 px-3 min-[48rem]:bottom-7 min-[48rem]:px-6 lg:px-10">
                  <h3 className="whitespace-pre-line text-xl font-bold leading-tight min-[48rem]:text-[28px] lg:text-[32px]" style={{ color: c.color }}>{c.title}</h3>
                  <p className="mt-2 text-sm font-bold text-[#f2efe7] min-[48rem]:mt-5 min-[48rem]:text-xl">{c.name}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section id="best" className="scroll-mt-8 px-5 py-16 md:px-[10%] md:py-24">
          <h2 className="text-center text-[32px] font-bold">BEST</h2>
          <div className="mx-auto mt-7 flex max-w-[1422px] justify-end"><button onClick={() => { chooseConcern(0); document.getElementById('concern')?.scrollIntoView({ behavior: 'smooth' }); }} className="min-h-11 text-sm text-[#5e5a52]">더보기 →</button></div>
          <div className="relative mx-auto max-w-[1422px]">
            <button aria-label="이전 베스트 제품" onClick={() => bestRef.current?.scrollBy({ left: -(bestRef.current.clientWidth / 3 + 8), behavior: 'smooth' })} className="absolute top-[35%] -left-12 hidden min-h-11 min-w-11 items-center justify-center md:flex"><Asset file="bfe41.svg" alt="" /></button>
            <div ref={bestRef} {...bestDrag} className="flex cursor-grab snap-x snap-proximity gap-5 overflow-x-auto pb-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {best.map(p => <ProductCard key={p.image} product={p} best add={add} open={openProduct} />)}
            </div>
            <button aria-label="다음 베스트 제품" onClick={() => bestRef.current?.scrollBy({ left: bestRef.current.clientWidth / 3 + 8, behavior: 'smooth' })} className="absolute top-[35%] -right-12 hidden min-h-11 min-w-11 items-center justify-center md:flex"><Asset file="7d49d.svg" alt="" /></button>
          </div>
        </section>
        <section id="routine" className="scroll-mt-8 bg-gradient-to-t from-[#e6b725] to-white px-5 pt-14 pb-14 md:px-10 md:pt-[72px]">
          <h2 className="text-center text-2xl font-bold md:text-[32px]">달바와 함께 하는 루틴</h2>
          <Tabs labels={routines.map(r => r.label)} active={routine} onChange={setRoutine} label="데일리 루틴" />
          <div {...routineDrag} role="tabpanel" aria-label={`${routines[routine].label} 루틴`} className="mx-auto mt-12 flex max-w-[1280px] cursor-grab snap-x snap-proximity gap-6 overflow-x-auto pb-5 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4">
            {routines[routine].products.map((p, i) => (
              <div key={p.image} className="min-w-[68vw] snap-start text-center md:min-w-0">
                <div className="relative mb-10 flex justify-center before:absolute before:top-5 before:-right-3 before:-left-3 before:border-t before:border-dashed before:border-[#a39469]">
                  <span className="relative rounded-full border border-[#d8c7a2] bg-[#f8f6ef] px-6 py-3 text-xs text-[#5e5a52]">STEP 0{i + 1}</span>
                </div>
                <ProductCard product={p} routine add={add} open={openProduct} />
              </div>
            ))}
          </div>
          <div className="mt-9 flex justify-center"><Pill onClick={() => add(routines[routine].products)}>루틴 세트 담기 <Asset file="787fe.svg" alt="" /></Pill></div>
        </section>
        <section id="home-try" className="scroll-mt-8 px-6 py-20 md:py-[125px]">
          <div className="mx-auto max-w-[760px]">
            <p className="text-base leading-snug md:text-2xl">나에게 맞는지 충분히 써보고<br />구매 결정하세요!</p>
            <div className="mt-5 flex items-center gap-3 text-2xl md:text-5xl"><span>선체험</span><div className="h-px flex-1 bg-[#999]" /><span>후결제</span></div>
            <h2 className="mt-1 text-center font-['Inter:Bold'] text-[clamp(48px,9vw,128px)] font-bold leading-tight tracking-[0.13em]">Home-Try</h2>
            <div className="mt-12 flex justify-center"><Pill onClick={() => navigate('전체보기')}>지금 바로 진행중인 제품 보러가기</Pill></div>
          </div>
        </section>
      </main>}
      <footer id="footer" className="bg-[#242321] px-6 pt-12 pb-8 text-sm leading-6 text-[#dcd7cd] md:px-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Asset file="771f1.svg" alt="d’Alba" />
            <p className="mt-5 max-w-[340px] text-[#bfbfbf]"><strong>주식회사 달바글로벌</strong><br />서울특별시 마포구 마포대로 78<br />(도화동, 자람빌딩) (04031)<br />CEO 반성연. Hosting by NHN Commerce<br />Tel 02-332-7727. Email dalba@dalba.com<br />Business Registeration No. 840-88-00333.<br />Online Sales Reg No. 제 2016-서울마포-0721호</p>
          </div>
          <div><h3 className="mb-5 font-bold text-white">고객센터</h3><a className="inline-flex min-h-11 items-center text-xl font-bold text-white" href="tel:023327727">02-332-7727</a><p>평일 10:00–17:00<br />주말·공휴일 휴무<br />FAQ · 1:1 문의</p></div>
          {[['쇼핑 안내', '배송 안내', '교환 · 반품', '멤버십 안내', '매장 · 입점처'], ['약관 · 정책', '이용약관', '개인정보처리방침', '사업자정보확인', '공지사항']].map(group => (
            <div key={group[0]}><h3 className="mb-5 font-bold text-white">{group[0]}</h3>{group.slice(1).map(text => <button key={text} className="block min-h-11 text-left" onClick={() => setOverlay({ title: text, body: '해당 안내 페이지는 제공되지 않았습니다. 자세한 내용은 고객센터 02-332-7727로 문의해 주세요.' })}>{text}</button>)}</div>
          ))}
          <div><h3 className="mb-5 font-bold text-white">FOLLOW</h3><div className="flex gap-6">{['7970d.svg', '22c5e.svg', '743de.svg'].map((file, i) => <Asset key={file} file={file} alt={['Instagram', 'YouTube', 'Facebook'][i]} />)}</div><p className="mt-7">Information manager 유명한</p></div>
        </div>
        <p className="mx-auto mt-10 max-w-[1280px] border-t border-[#5e5a52] pt-7 text-xs text-[#bfbfbf]">© 2026 d’Alba Global Co. All rights reserved.</p>
      </footer>
      {notice && <div role="status" className="fixed bottom-6 left-1/2 z-[60] w-max max-w-[90vw] -translate-x-1/2 bg-[#242321] px-6 py-4 text-center text-sm text-white">{notice}</div>}
      {overlay && <Dialog title={overlay.title} close={close}>
        {overlay.body && <p className="text-base leading-7 text-[#5e5a52]">{overlay.body}</p>}
        {overlay.product && <><button onClick={openProduct} aria-label={`${overlay.product.name} 상세 페이지로 이동`}><Picture file={overlay.product.image} alt={overlay.product.name} className="mx-auto aspect-square w-full max-w-[280px] object-contain" /></button><p className="my-6 text-center">{overlay.product.size} · {overlay.product.price.toLocaleString()}원</p><div className="flex justify-center"><Pill onClick={() => add([overlay.product!])}>장바구니 담기</Pill></div></>}
        {overlay.kind === 'cart' && <><p className="mb-5 text-sm text-[#5e5a52]">이 브라우저에만 저장되는 미리보기 장바구니입니다. 주문·결제는 연결되지 않았습니다.</p>{cart.length ? cart.map((p, i) => <div key={`${p.image}-${i}`} className="flex items-center gap-4 border-b border-[#e6e0d5] py-3"><Picture file={p.image} alt={p.name} className="h-20 w-20 object-contain" /><div className="min-w-0 flex-1 text-sm"><p>{p.name}</p><p className="mt-2">{p.price.toLocaleString()}원</p></div><button aria-label={`${p.name} 삭제`} onClick={() => setCart(c => c.filter((_, n) => n !== i))} className="min-h-11 min-w-11 text-xl">×</button></div>) : <p className="py-10 text-center">장바구니가 비어 있습니다.</p>}<p className="mt-6 text-right font-bold">합계 {total.toLocaleString()}원</p></>}
        {overlay.kind === 'search' && <><input autoFocus aria-label="제품명 검색" placeholder="제품명을 입력해 주세요" value={query} onChange={e => setQuery(e.target.value)} className="min-h-12 w-full border-b border-[#999] px-2 text-base outline-none focus:ring-2" /><div className="mt-5">{query && !searchResults.length && <p className="py-8 text-center">검색 결과가 없습니다.</p>}{(query ? searchResults : best).map(p => <button key={p.name} onClick={() => openProduct(p)} className="flex min-h-11 w-full items-center gap-4 border-b border-[#e6e0d5] py-3 text-left"><Picture file={p.image} alt="" className="h-16 w-16 object-contain" /><span className="text-sm">{p.name}</span></button>)}</div></>}
        {overlay.kind === 'quiz' && <div ref={quizPanelRef}>
          {quizStep > 0 && <div aria-label="이전 문항에서 선택한 답변" className="mb-6 space-y-2">
            {quiz.slice(0, quizStep).map((answer, index) => <p key={index} className="rounded border border-[#e6e0d5] bg-[#faf9f5] px-4 py-3 text-sm">
              <span className="mr-2 font-semibold text-[#a2720c]">{index + 1}단계</span>{answer}
            </p>)}
          </div>}
          {quizStep < 3 ? <div>
            <p className="mb-3 text-sm text-[#5e5a52]">{quizStep + 1} / 3</p>
            <h3 className="mb-6 text-lg font-bold">{quizQuestions[quizStep]}</h3>
            <div className="grid gap-3">{quizOptions[quizStep].map(answer => <button key={answer} aria-pressed={quiz[quizStep] === answer} onClick={() => chooseQuizAnswer(answer)} className={`min-h-12 border px-5 text-left hover:bg-[#f2efe7] ${quiz[quizStep] === answer ? 'border-[#a2720c] bg-[#f2efe7] font-bold' : 'border-[#d8c7a2]'}`}>{answer}</button>)}</div>
            {quizStep > 0 && <button className="mt-4 min-h-11" onClick={previousQuizStep}>← 이전 문항</button>}
          </div> : <div className="text-center">
            <p className="mb-4 text-sm text-[#5e5a52]">선택한 사용감에 따른 제품 추천이며, 의학적 진단이 아닙니다.</p>
            <ProductCard product={concerns[3].products[quiz[0] === '민감성' ? 3 : quiz[1] === '자연스러운 톤업' ? 0 : 1]} add={add} open={openProduct} />
            <button className="mt-6 min-h-11 underline" onClick={previousQuizStep}>← 이전 문항</button>
            <button className="mt-6 ml-5 min-h-11 underline" onClick={resetQuiz}>다시 진단하기</button>
          </div>}
        </div>}
      </Dialog>}
    </div>
  );
}
