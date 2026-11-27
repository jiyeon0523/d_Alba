import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Product } from './data';

export function Picture({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <svg className={className} viewBox="0 0 300 300" role="img" aria-label={`${alt || '이미지'} 로딩 실패`}><rect width="300" height="300" fill="#f2efe7" /><text x="150" y="145" textAnchor="middle" fontSize="20" fill="#242321">이미지를 불러올 수 없습니다</text></svg>;
  return <img src={`${import.meta.env.BASE_URL}assets/${file}`} alt={alt} className={className} onError={() => setFailed(true)} />;
}
export function Asset({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  return <Picture file={file} alt={alt} className={`shrink-0 ${className}`} />;
}
export function Pill({ children, onClick, light = false }: { children: ReactNode; onClick: () => void; light?: boolean }) {
  return <button onClick={onClick} className={`inline-flex min-h-14 min-w-[210px] items-center justify-center gap-3 rounded-full px-7 text-base font-bold focus-visible:ring-2 md:min-w-[250px] ${light ? 'bg-[#f2efe7] text-black' : 'bg-[#242321] text-white'}`}>{children}</button>;
}
export function Tabs({ labels, active, onChange, label, textClassName = 'text-sm md:text-base' }: { labels: string[]; active: number; onChange: (i: number) => void; label: string; textClassName?: string }) {
  return (
    <div role="tablist" aria-label={label} className="mx-auto mt-7 flex w-fit max-w-full justify-center gap-1 md:gap-3">
      {labels.map((text, i) => <button key={text} role="tab" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => onChange(i)}
        onKeyDown={e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? labels.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + labels.length) % labels.length; onChange(next); (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); } }}
        className={`min-h-11 min-w-12 px-2 md:min-w-24 md:px-4 ${textClassName} ${active === i ? 'font-bold text-black' : 'text-[#5e5a52]'}`}>{text}</button>)}
    </div>
  );
}
export function ProductCard({ product: p, add, open, best = false, routine = false, centerPrice = false, imageHoverBg = false }: { product: Product; add: (p: Product[]) => void; open: (p: Product) => void; best?: boolean; routine?: boolean; centerPrice?: boolean; imageHoverBg?: boolean }) {
  return (
    <article className={`group min-w-0 shrink-0 snap-start text-center ${best ? 'basis-[78%] md:basis-[calc((100%-40px)/3)]' : routine ? 'w-full' : 'basis-[76%] md:basis-auto'}`}>
      <div className={`relative overflow-hidden bg-white ${imageHoverBg ? 'transition-colors hover:bg-[#E2AF1D]' : ''} ${best ? 'aspect-[460/435]' : routine ? 'aspect-square' : 'aspect-[380/356]'}`}>
        <button aria-label={`${p.name} 자세히 보기`} onClick={() => open(p)} className="block h-full w-full overflow-hidden">
          <Picture file={p.image} alt={p.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.2] motion-reduce:transition-none" />
        </button>
        <button aria-label={`${p.name} 장바구니 담기`} onClick={() => add([p])} className="absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white md:invisible md:group-hover:visible md:group-focus-within:visible"><span className="flex h-8 w-8 items-center justify-center"><Asset file="7f549.svg" alt="" /></span></button>
      </div>
      {routine ? <><h3 className="mt-7 text-base font-bold">{p.category}</h3><button onClick={() => open(p)} className="mt-6 min-h-11 text-sm font-medium" style={{ fontFamily: "'Inter:Medium', 'Noto Sans KR:Medium', sans-serif" }}>{p.name}</button><p className="text-sm">{p.price.toLocaleString()}원</p></> : <>
        <p className="mt-5 min-h-5 text-sm text-[#5e5a52]">{p.tags}</p>
        <button onClick={() => open(p)} className="mt-2 min-h-11 text-base font-bold lg:text-lg">{p.name}</button>
        <p className="mt-3 text-sm">{p.size}</p>
        <div className={`mt-5 flex items-center ${best || centerPrice ? 'justify-center' : 'justify-between'} gap-2 ${centerPrice ? 'relative' : ''}`}>
          <p className={`${centerPrice ? '' : 'flex-1'} text-base font-medium lg:text-lg`}>{p.price.toLocaleString()}원</p>
          {!best && p.reviews && <span className={`flex items-center gap-1 text-xs ${centerPrice ? 'absolute right-0' : ''}`}><span className="scale-50"><Asset file="97dc8.svg" alt="리뷰" /></span>{p.reviews}</span>}
        </div>
      </>}
    </article>
  );
}
const menus = [
  { title: '브랜드', items: ['달바 스토리', '화이트 트러플', '제품검증과 비건'] },
  { title: '컬렉션', items: ['항산화', '비건', '수분·보습', '저자극·진정'] },
  { title: '제품', items: ['전체보기', '시그니처', '베스트', '미스트', '세럼·토너·앰플', '선크림', '디바이스', '로션·앰플·아이크림', '마스크', '클렌징', '메이크업', '맨즈케어', '헤어·바디·핸드', '비거너리', '프래그런스'] },
  { title: '케어 가이드', items: ['루틴 추천', '나의 선케어 찾기'] },
  { title: '홈 트라이', items: [] },
  { title: '커뮤니티', items: ['리뷰', '공지사항', '이벤트'] },
];
export function Header({ navigate, search, cart, home, detail, count }: { navigate: (s: string) => void; search: () => void; cart: () => void; home: () => void; detail: () => void; count: number }) {
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  function go(text: string, isSubmenu = false) { setMobile(false); setActive(null); if (isSubmenu) detail(); else navigate(text); }
  return (
    <header className="relative z-30 border-b border-[#e6e0d5] bg-white" onKeyDown={e => { if (e.key === 'Escape') { setMobile(false); setActive(null); } }}>
      <div className="relative mx-auto flex h-20 max-w-[1580px] items-center justify-between px-4 lg:h-[68px] lg:justify-center lg:px-8">
        <button aria-label={mobile ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={mobile} onClick={() => { setMobile(!mobile); setActive(null); }} className="min-h-11 min-w-11 text-2xl lg:hidden">{mobile ? '×' : '☰'}</button>
        <a href={import.meta.env.BASE_URL} aria-label="달바 메인 페이지" className="flex min-h-11 items-center gap-3" onClick={e => { e.preventDefault(); setMobile(false); setActive(null); home(); }}>
          <Asset file="ad7d9.svg" alt="d’Alba piedmont" /><Asset file="05230.svg" alt="" /><Picture file="e8fb2.png" alt="d’Alba signature" className="h-[31px] w-[76px] object-contain" />
        </a>
        <div className="absolute right-8 hidden items-center gap-4 text-sm text-[#5e5a52] lg:flex">
          <button className="min-h-11" onClick={() => go('회원가입')}>회원가입</button><button className="min-h-11" onClick={() => go('고객센터')}>고객센터</button><span className="flex items-center gap-1">한국어 <Asset file="8ca25.svg" alt="" /></span>
        </div>
        <button aria-label={`장바구니 ${count}개`} className="relative flex min-h-11 min-w-11 items-center justify-center lg:hidden" onClick={cart}><Asset file="7f549.svg" alt="" />{count > 0 && <span className="absolute top-0 right-0 rounded-full bg-[#e7bb38] px-1 text-xs">{count}</span>}</button>
      </div>
      <div className="mx-auto hidden h-[52px] max-w-[1580px] items-center justify-end px-8 lg:flex">
        <nav aria-label="메인 메뉴" className="mr-[5%] flex h-full w-[68%] items-center justify-between">
          {menus.map((m, i) => <div key={m.title} className="relative h-full" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setActive(null); }}>
            <button aria-expanded={m.items.length ? active === i : undefined} onFocus={() => setActive(i)} onClick={() => m.items.length ? setActive(active === i ? null : i) : go(m.title)} className="h-full min-w-16 text-[17px] font-semibold transition-colors hover:text-[#A2720C]">{m.title}</button>
            {!!m.items.length && <div inert={active !== i} className={`absolute top-full left-1/2 grid -translate-x-1/2 overflow-hidden bg-white transition-[grid-template-rows] duration-300 ${active === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="min-h-0"><div className={`grid gap-x-6 px-6 py-4 ${i === 2 ? 'w-[560px] grid-flow-col grid-rows-4' : 'min-w-[170px]'}`}>{m.items.map(item => <button key={item} onClick={() => go(item, true)} className="min-h-11 whitespace-nowrap text-[15px] hover:text-[#A2720C] hover:underline">{item}</button>)}</div></div>
            </div>}
          </div>)}
        </nav>
        <div className="flex gap-3">{[{ file: 'ee74e.svg', label: '검색', action: search }, { file: '59551.svg', label: '관심상품', action: () => go('관심상품') }, { file: '7f549.svg', label: `장바구니 ${count}개`, action: cart }, { file: '0d99e.svg', label: '마이페이지', action: () => go('마이페이지') }].map(a => <button key={a.file} aria-label={a.label} onClick={a.action} className="relative flex min-h-11 min-w-11 items-center justify-center"><Asset file={a.file} alt="" className={a.file === '59551.svg' ? '' : 'h-6 w-6'} />{a.file === '7f549.svg' && count > 0 && <span className="absolute top-0 right-0 rounded-full bg-[#e7bb38] px-1 text-xs">{count}</span>}</button>)}</div>
      </div>
      {mobile && <nav aria-label="모바일 메뉴" className="absolute inset-x-0 top-full max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-[#e6e0d5] bg-white px-6 pb-8 lg:hidden">
        <button onClick={search} className="flex min-h-14 w-full items-center justify-between border-b border-[#e6e0d5] text-sm">제품 검색 <Asset file="ee74e.svg" alt="" /></button>
        {menus.map((m, i) => <div key={m.title} className="border-b border-[#e6e0d5]">
          <button aria-expanded={active === i} onClick={() => m.items.length ? setActive(active === i ? null : i) : go(m.title)} className="flex min-h-16 w-full items-center justify-between text-[17px] font-semibold hover:text-[#A2720C]">{m.title}<span aria-hidden="true">{m.items.length ? active === i ? '−' : '+' : '→'}</span></button>
          {!!m.items.length && <div inert={active !== i} aria-hidden={active !== i} className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${active === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="min-h-0 overflow-hidden">
              <div className="grid grid-cols-2 gap-x-4 bg-[#faf9f5] px-4 py-3">{m.items.map(item => <button key={item} onClick={() => go(item, true)} className="min-h-11 text-left text-[15px] hover:text-[#A2720C]">{item}</button>)}</div>
            </div>
          </div>}
        </div>)}
        <div className="mt-5 flex gap-6">{['회원가입', '고객센터', '관심상품', '마이페이지'].map(x => <button className="min-h-11 text-sm" key={x} onClick={() => go(x)}>{x}</button>)}</div>
      </nav>}
    </header>
  );
}
const slides = [
  { image: '1e245.png', title: 'd’Alba Vita Synergy', badge: '100 Hours Moisturizing', lines: ['비타 시너지로 피부 활력을 깨워', '생기있게 빛나는 피부 케어'] },
  { image: 'f4b9e.png', title: 'd’Alba Veganery', badge: 'VECAN DAILY INNER CARE', lines: ['자연주의 비건 이너뷰티,', '비거너리 바이 달바'] },
  { image: '45b0d.png', title: 'd’Alba Allthera Double Shot', badge: '100 Hours Moisturizing', lines: ['QUICK&EASY', '한 번에 트리플 3샷, 쉽고 빠른 2분 케어'] },
];
export function Hero({ onAction }: { onAction: (index: number) => void }) {
  const [position, setPosition] = useState(0);
  const [transition, setTransition] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const moving = useRef(false);
  const touch = useRef(0);
  const active = position % slides.length;
  function moveTo(index: number) {
    if (moving.current) return;
    const distance = (index - active + 3) % 3;
    if (!distance) { setCycle(c => c + 1); return; }
    moving.current = true; setTransition(true); setPosition(p => p + distance); setCycle(c => c + 1);
  }
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => { moving.current = true; setTransition(true); setPosition(p => p + 1); setCycle(c => c + 1); }, 5000);
    return () => clearTimeout(timer);
  }, [cycle, paused]);
  useEffect(() => {
    if (!transition || !moving.current) return;
    const timer = setTimeout(() => {
      moving.current = false;
      if (position >= 3) { setTransition(false); setPosition(position % 3); }
    }, 750);
    return () => clearTimeout(timer);
  }, [position, transition]);
  function settled() {
    moving.current = false;
    if (position >= 3) { setTransition(false); setPosition(position % 3); }
  }
  return (
    <section aria-label="달바 주요 소식" aria-roledescription="carousel" className="relative overflow-hidden" onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setPaused(false); setCycle(c => c + 1); } }}
      onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { if (Math.abs(e.changedTouches[0].clientX - touch.current) > 40) moveTo((active + 1) % 3); }}>
      <div className={`flex ${transition ? 'transition-transform duration-700 ease-in-out motion-reduce:duration-0' : ''}`} style={{ transform: `translateX(-${position * 100}%)` }} onTransitionEnd={settled}>
        {[...slides, ...slides].map((slide, i) => <div key={i} aria-hidden={i !== position} inert={i !== position} className="relative h-[620px] w-full shrink-0 md:aspect-[8/3] md:h-auto md:min-h-[480px]">
          <Picture file={slide.image} alt={['비타 시너지 세럼과 화이트 트러플', '청포도와 비거너리 비건 이너뷰티', '올쎄라 더블샷 뷰티 디바이스'][i % 3]} className={`absolute inset-0 h-full w-full object-cover ${i % 3 === 2 ? 'object-[82%_center]' : 'object-[68%_center]'} md:object-center`} />
          <div className="absolute right-5 bottom-20 left-6 md:top-[30%] md:right-auto md:bottom-auto md:left-[8.85%] xl:top-[40.4%]">
            <span className="relative inline-flex min-h-[22px] items-center justify-center px-3"><span className="absolute inset-0 overflow-hidden rounded-full bg-[#e7bb38]"><Asset file="dc1a5.svg" alt="" /></span><span className="relative font-['Inter:Bold'] text-xs font-bold text-[#242321]">{slide.badge}</span></span>
            <h1 className="mt-2 max-w-[320px] font-['Inter:Bold'] text-[30px] font-bold leading-tight text-black md:max-w-none md:text-[clamp(28px,2.5vw,48px)]">{slide.title}</h1>
            <p className="mt-5 text-base leading-[1.12] font-medium text-black md:mt-8 md:text-[clamp(16px,1.25vw,24px)]">{slide.lines[0]}<br />{slide.lines[1]}</p>
            <div className="mt-7 md:mt-[3vw]"><Pill onClick={() => onAction(i % 3)}>제품 보러가기</Pill></div>
          </div>
        </div>)}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-5">
        {slides.map((_, i) => <button key={i} aria-label={`${i + 1}번 배너로 이동`} aria-pressed={active === i} onClick={() => moveTo(i)} className="flex min-h-11 w-[58px] items-center"><span className="h-0.5 w-full overflow-hidden bg-[#aaa9a1]">{active === i && <span key={cycle} className="block h-full w-full origin-left bg-black motion-reduce:animate-none" style={{ animation: 'slide-progress 5s linear forwards', animationPlayState: paused ? 'paused' : 'running' }} />}</span></button>)}
        <span className="ml-1 whitespace-nowrap text-[15px] text-[#49463f]"><span className="font-bold">0{active + 1}</span> / 03</span>
      </div>
    </section>
  );
}
