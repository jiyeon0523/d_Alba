export type Product = {
  name: string; image: string; price: number; size?: string;
  tags?: string; reviews?: string; category?: string;
};
const p = (name: string, image: string, price: number, size = '', tags = '', reviews = ''): Product => ({ name, image, price, size, tags, reviews });
const layer = p('화이트 트러플 더블 레이어 세럼 펩타이드', 'e4260.png', 62000, '30ml/50ml', '#비건 #수분보습 #영양탄력 #저자극 #주름', '37,599');
const balm = p('더블 세럼 올인원 멀티밤', 'c41be.png', 34000, '10g', '#비건 #주름 #저자극 #미백 #영양탄력', '34,743');
const cream = p('화이트 트러플 더블 모이스처 크림', 'a1c18.png', 62000, '60ml', '#비건 #수분보습 #영양탄력 #저자극 #주름', '17,308');
const signature = p('달바 시그니처 안티에이징 탄력 스프레이 엠플', '6f61d.png', 46000, '60ml', '#안티에이징 #비타민 #농축탄력', '1,510');
export const first = p('화이트 트러플 퍼스트 스프레이 세럼 펩타이드', '9dfb9.png', 29000, '100ml', '#수분장벽 #수분레이어링 #수분광', '179,753');
const vital = p('화이트 트러플 바이탈 스프레이 세럼 나이아신아마이드 5퍼센트', '19d73.png', 46000, '100ml', '#비건 #수분보습 #진정 #저자극', '33,506');
const pink = p('워터풀 톤업 선크림', '43301.png', 34000, '50ml', '#비건 #수분보습 #톤보정 #저자극', '203,208');
const essence = p('워터풀 에센스 선크림', '75aa3.png', 34000, '50ml', '#비건 #수분보습 #미백 #주름', '13,661');
const mild = p('워터풀 마일드 선크림', '82d19.png', 34000, '50ml', '#비건 #저자극 #민감성', '55,086');
export const concerns = [
  { label: '탄력', products: [layer, balm, cream, signature] },
  { label: '수분', products: [first, layer, p('화이트 트러플 프라임 인텐시브 세럼', '9a343.png', 46000, '50ml / 100ml / 150ml', '#안티에이징 #보습144시간 #비건콜라겐세럼', '1,311'), vital] },
  { label: '진정', products: [vital, p('더블 퀵 리포좀 세럼 마스크 패드', '5a493.png', 42000, '', '#피부타입맞춤 #올인원패드 #진정결정돈'), p('워터풀 비건 슬리핑팩', 'd40d3.png', 28000, '60ml', '#비건 #수분보습 #진정 #주름 #윤기'), p('클린 티트리 리포좀 시카 카밍 마스크', 'f5914.png', 25000, '', '#비건 #수분보습 #진정 #저자극')] },
  { label: '자외선', products: [pink, essence, p('에이 핏 프레쉬 선 스틱', 'c2132.png', 36000, '10g', '#비건 #수분보습 #저자극 #미백', '48,528'), mild] },
  { label: '톤업', products: [pink, p('워터풀 톤업 선크림(퍼플)', '523ef.png', 34000, '50ml', '#톤업 선크림 #톤보정 #노란기', '32,674'), p('클린 티트리 리포좀 톤업 선크림(그린)', '0619e.png', 34000, '50ml', '#티트리 #톤업 선크림 #톤보정 #붉은기', '6,421'), p('워터풀 톤업 선크림(내추럴 커버 베이지)', '1e0e7.png', 36000, '50ml', '#베이지선크림 #쌩얼크림 #산뜻촉촉', '7,999')] },
];
export const best = [
  p('화이트 트러플 더블 퍼스트 스프레이 세럼', '06805.png', 29000, '100ml', '#수분광채 #탄력미스트'),
  p('워터풀 톤업 선크림', '7ce59.png', 32000, '50ml', '#핑크빛물광 #파데프리'),
  p('더블 세럼 올인원 멀티밤', 'f8d11.png', 42000, '10g', '#이중코어 #탄력미백'),
  p('워터풀 에센스 선크림', '3cdac.png', 23000, '50ml', '#24시간보습유지 #촉촉산뜻'),
  p('리턴 오일 크림 클렌저', '3d847.png', 21000, '100ml / 160ml', '#올인원클렌저 #스파워터함유'),
];
const r = (category: string, name: string, image: string, price: number): Product => ({ category, name, image, price });
export const routines = [
  { label: '아침', products: [
    r('클렌징', '화이트 트러플 딥 크린 폼 클렌저', 'c22a6.png', 28000),
    r('세럼', '비타 토닝 세럼 토너 나이아신아마이드 5퍼센트', 'd7071.png', 29000),
    r('크림', '화이트 트러블 더블 모이스처 크림', 'a1c18.png', 62000),
    r('선케어', '워터풀 마일드 선크림', '82d19.png', 34000),
  ] },
  { label: '외출', products: [
    { ...layer, category: '세럼', tags: '', reviews: '', size: '' },
    r('로션', '비타 토닝 세럼 로션 나이아신아마이드 5퍼센트', '3109a.png', 42000),
    r('선케어', '워터폴 톤업 선크림(내추럴 커버 베이지)', '1e0e7.png', 36000),
    r('메이크업', '스킨 핏 그라인딩 세럼 커버 팩트', 'f1ffd.png', 46000),
  ] },
  { label: '나이트', products: [
    r('클렌징', '리턴 오일 크림 클렌저', '3d847.png', 21000),
    r('세럼', '비타 토닝 캡슐 세럼 나이아신아마이드 5퍼센트', '0767e.png', 58000),
    r('크림', '화이트 트러플 더블 세럼 앤 크림', 'f703b.png', 78000),
    r('미스트', '화이트 트러플 퍼스트 스프레이 세럼 펩타이드', '9dfb9.png', 29900),
  ] },
];
export const collections = [
  { image: 'caedb.png', title: 'Natural,\nbut Powerful', name: '프리미엄 탄력 컬렉션', description: '화이트 트러플이 선사하는 항산화 탄력', color: '#e7bb38' },
  { image: '713c4.png', title: 'Clean &\nVegan Beauty', name: '비건 컬렉션', description: '까다롭고 건강한 아름다움이 깃든 클린뷰티', color: '#c1da7b' },
  { image: 'ddb9e.png', title: 'Moist\n& Watery', name: '수분보습 컬렉션', description: '수분공급과 보습 유지를 도와 건조한 피부 개선', color: '#c7e3e9' },
  { image: 'e60be.png', title: 'Mild\nCalming', name: '저자극 진정·컬렉션', description: '민감성 피부 및 인체피부 일차자극 테스트 완료', color: '#f2efe7' },
];
