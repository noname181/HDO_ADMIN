### HDO Web Admin

### Directory 구조

apis : api 통신 관련
AUI : AUIGrid 파일
components : layouts, common 및 컴포넌트
constants : 상수 모음
hooks : hook 모음
interfaces : interface, type 모음
pages : page 컴포넌트
recoil : recoil 관련 전역 관리 함수
styles : 전역 CSS 스타일, globalstyle 등
utils : 함수

### git commit 관련 규칙

feat : 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정
fix : 기능에 대한 버그 수정
build : 빌드 관련 수정
chore : 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
ci : CI 관련 설정 수정
docs : 문서(주석) 수정
style : 코드 스타일, 포맷팅에 대한 수정
refactor : 기능의 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
test : 테스트 코드 추가/수정
release : 버전 릴리즈

📦src
┣ 📂apis
┣ 📂AUI
┃ ┣ 📂AUIGrid
┃ ┃ ┣ 📜AUIGrid.js
┃ ┃ ┣ 📜AUIGrid_style.css
┃ ┃ ┗ 📜style.css
┃ ┗ 📂AUIGrid-React
┃ ┃ ┗ 📜AUIGridReact.tsx
┣ 📂components
┃ ┣ 📂common
┃ ┃ ┣ 📂Button
┃ ┃ ┃ ┣ 📜Button.tsx
┃ ┃ ┃ ┣ 📜CloseButton.tsx
┃ ┃ ┃ ┗ 📜TableButton.tsx
┃ ┃ ┣ 📂Checkbox
┃ ┃ ┃ ┗ 📜Checkbox.tsx
┃ ┃ ┣ 📂Form
┃ ┃ ┃ ┗ 📜Form.tsx
┃ ┃ ┣ 📂Input
┃ ┃ ┃ ┗ 📜Input.tsx
┃ ┃ ┣ 📂Modal
┃ ┃ ┃ ┣ 📜ErrorModal.tsx
┃ ┃ ┃ ┗ 📜Modal.tsx
┃ ┃ ┣ 📂Radio
┃ ┃ ┃ ┗ 📜Radio.tsx
┃ ┃ ┣ 📂Select
┃ ┃ ┃ ┣ 📜Select copy.tsx
┃ ┃ ┃ ┗ 📜Select.tsx
┃ ┃ ┣ 📂Tab
┃ ┃ ┃ ┣ 📜LoginTab.tsx
┃ ┃ ┃ ┗ 📜Tab.tsx
┃ ┃ ┗ 📂TabHead
┃ ┃ ┃ ┗ 📜TabHead.tsx
┃ ┗ 📂layout
┃ ┃ ┣ 📂Navbar
┃ ┃ ┃ ┣ 📜index.tsx
┃ ┃ ┃ ┗ 📜styled.tsx
┃ ┃ ┣ 📂Sidebar
┃ ┃ ┃ ┣ 📜index.tsx
┃ ┃ ┃ ┗ 📜styled.tsx
┃ ┃ ┗ 📜Layout.tsx
┣ 📂config
┃ ┗ 📜auth.ts
┣ 📂constants
┃ ┗ 📜sidebar.js
┣ 📂hooks
┃ ┣ 📜useAsync.tsx
┃ ┗ 📜useAuth.tsx
┣ 📂interfaces
┃ ┗ 📜Sidebar.ts
┣ 📂pages
┃ ┣ 📂admin
┃ ┃ ┗ 📜AdminContainer.tsx
┃ ┣ 📂charger
┃ ┃ ┣ 📜ChargingPage.tsx
┃ ┃ ┗ 📜ChargingStation.tsx
┃ ┣ 📂chargerData
┃ ┃ ┗ 📜ChargerDataContainer.tsx
┃ ┣ 📂dashboard
┃ ┃ ┣ 📜DashboardContainer.tsx
┃ ┃ ┗ 📜DashGrid.tsx
┃ ┣ 📂login
┃ ┃ ┣ 📜LoginForm.tsx
┃ ┃ ┣ 📜LoginPage.styled.tsx
┃ ┃ ┗ 📜LoginPage.tsx
┃ ┣ 📂member
┃ ┃ ┗ 📜MemberContainer.tsx
┃ ┣ 📂payment
┃ ┃ ┗ 📜PaymentContainer.tsx
┃ ┣ 📂systemList
┃ ┃ ┗ 📜SystemListContainer.tsx
┃ ┣ 📜PageRouter.tsx
┃ ┗ 📜styled.tsx
┣ 📂recoil
┃ ┣ 📂atom
┃ ┃ ┗ 📜errorStateAtom.ts
┃ ┗ 📜authState.ts
┣ 📂styles
┃ ┣ 📜font.css
┃ ┣ 📜GlobalStyle.ts
┃ ┣ 📜layout.css
┃ ┣ 📜style.css
┃ ┗ 📜style.tsx
┣ 📂utils
┃ ┗ 📜apiUtils.ts
┣ 📜App.tsx
┗ 📜index.tsx
