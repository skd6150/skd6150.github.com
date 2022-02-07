---
title: 반응형 이미지
date: "2022-01-18"
categories: ["HTML"]
---

반응형 이미지는 이미지의 크기에 따라 다른 이미지를 보여주는 '아트 디렉션'과 작은 이미지에는 저밀도, 큰 이미에는 고밀도의 사진을 보여주는 '해상도 전환'을 도와주는 기법이다.

### 1. 해상도 전환

사진의 해상도와 파일 크기는 비례한다. 고밀도의 사진은 큰 용량을 필요로 하고 저밀도의 사진은 적은 용량만을 필요로 한다.

따라서, 배경화면같은 크게 표시되는 사진들은 용량이 크더라도 고밀도의 사진을 이용해 사진의 도트가 깨져보이지 않도록 해야하고, 반대로 아이콘이나 프로필사진 같은 비교적 작게 표시되는 사진은 저밀도의 사진을 사용해 대역폭을 줄여주도록 하는 것이 바람직 하다.

<br>

반응형 이미지 기능은 img태그에 전통적으로 쓰이던 src속성 외에 srcset과 sizes 속성을 추가함으로서 사용할 수 있다.

```html
<img
  srcset="./image-450w.png 450w, ./image-600w.png 600w, ./image-750w.png 750w"
  sizes="(max-width: 450px) 450px, (max-width: 600px) 600px, 750px"
  src="./image-750w.png"
/>
```

**srcset** 속성은 이미지와 이미지의 크기를 정의하며 "이미지경로 이미지크기" 형식으로 나타낸다.

위 코드에서 첫번째 이미지 image-450w.png의 넓이가 450임을 뜻하고 두번째 이미지 image-600w.png의 넓이가 600임을 뜻한다.

단위 w는 고유 픽셀 넓이를 뜻하는데, 논리 픽셀인 CSS 픽셀과 달리 실제로 사진이 가진 물리적인 픽셀을 의미한다.

**sizes** 속성은 이미지가 가져야 할 크기를 정의하며, 위 예시처럼 미디어쿼리를 이용해 넓이를 반응형으로 구할 수 있는데 위 예시에서는 뷰포트의 넓이가 450px이하인 경우에 이미지의 넓이로 450px을 설정하고, 뷰포트의 넓이가 600px이하인 경우에 이미지의 넓이로 600px를 설정하고, 그 외 나머지 경우의 이미지의 넓이를 750px로 설정한다.

**src**태그는 반응형 이미지 기능을 지원하지 않는 브라우저가 이미지를 표시할 때 src에 참조된 이미지를 표시한다.

<br>

화면의 크기에 이미지를 선택하는 방법 외에도 디스플레이의 해상도에 따라 이미지를 선택하는 방법도 있다.

```html
<img
  srcset="./image-300w.png, ./image-450w.png 1.5x, ./image-600w.png 2x"
  src="./image-750w.png"
/>
```

srcset를 "이미지경로 x-배율"형식으로 표현하면 서술된 배열에 따라 적절한 해상도의 이미지를 선택할 수 있다. 즉, 디스플레이 해상도가 낮아 기기의 물리픽셀 1픽셀과 CSS 픽셀 1픽셀이 같은 경우엔 image-300w.png가 표시되고 디스플레이 해상도가 높아 기기의 물리픽셀 2픽셀과 CSS 픽셀 1픽셀이 같은 경우엔 image-600w.png가 표시된다.

### 2. 아트 디렉션

이미지의 비율을 유지한채로 이미지의 크기를 계속해서 줄이면 이미지가 작아질수록 이미지가 담고있는 내용들을 알아보기 힘들 것이다. 이를 위한 해결책이 아트 디렉션이며 아트 디렉션은 예를 들어 서있는 사람이 찍힌 사진이 있고 화면이 작아져 사진의 크기가 줄어들때, 사진 전체가 줄어들기 대신에 배경을 어느정도 잘라 사진의 가장 중요한 내용인 사람을 조금 더 크고 잘 보이도록 하는 방법이다.

예시) <a href="https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/responsive.html" class="external" rel=" noopener">responsive.html</a>, <a href="https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/not-responsive.html" class="external" rel=" noopener">not-responsive.html</a>

```html
<picture>
  <source media="(max-width: 450px)" srcset="./image-450w.png" />
  <source media="(max-width: 600px)" srcset="./image-600w.png" />
  <img src="./image-750w.png" />
</picture>
```

아트디렉션은 picture태그로 source태그와 img태그를 감싸서 만들 수 있고 위에서부터 source태그의 media 속성의 조건문을 검사해 조건문이 true를 리턴하는 경우 해당 source태그의 srcset에 따라 이미지가 표시된다.

위 예시에서는 뷰포트의 넓이가 450px 이하일 경우 image-450w.png, 451~600px인 경우 image-600w.png, 나머지 601px 이상인 경우엔 image-750w.png가 렌더링 된다.

참고: https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
