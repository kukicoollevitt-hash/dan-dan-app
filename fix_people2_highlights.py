#!/usr/bin/env python3
"""
people2_02~40 하이라이트 구조 일괄 적용 스크립트
1. people2_content.js의 explain 값을 <b>태그</b> 뒤 텍스트로 수정
2. 각 HTML 파일에 CSS, 함수, 호출 코드 추가
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/person'
content_file = os.path.join(base_path, 'people2_content.js')

# ============================================
# Part 1: explain 값 수정 (본문 <b>태그</b> 뒤 텍스트 기반)
# ============================================

# 각 유닛별 explain 수정값
# 형식: { unit: { q1: 'text', q2: 'text', q3: 'text', q4: 'text' } }
# 규칙: <b>키워드</b> 뒤에 나오는 텍스트로 설정

explain_fixes = {
    'people2_02': {
        # passage: <b>예술가</b>입니다, <b>후원</b>을 받아, <b>천장화</b>를 그려, <b>고난</b>을 겪으며, <b>열정</b>을 쏟아, <b>완성</b>했고
        # answerKey: q3_1:천장화, q3_2:고난, q4_1:열정, q4_2:걸작
        'q1': '를 그려 달라고 부탁했어요',  # <b>천장화</b> 뒤
        'q2': '입니다',  # <b>예술가</b> 뒤
        'q3': '을 겪으며 그림을 그렸어요',  # <b>고난</b> 뒤
        'q4': '을 쏟아 이 작품을',  # <b>열정</b> 뒤
    },
    'people2_03': {
        # passage: <b>극작가</b>의 꿈을, <b>무대</b> 위에서, <b>관객</b>의 자리를, <b>대본</b>을 쓰기, <b>공연</b>이 성공, <b>환호</b>가, <b>감동</b>을, <b>비극</b>
        # answerKey: q3_1:극작가, q3_2:관객, q4_1:감동, q4_2:비극
        'q1': '의 자리를 안내하는 일을 하며',  # <b>관객</b> 뒤
        'q2': '을 쓰기 시작했다',  # <b>대본</b> 뒤
        'q3': '의 꿈을 키워갔다',  # <b>극작가</b> 뒤
        'q4': '을 주었다',  # <b>감동</b> 뒤
    },
    'people2_04': {
        # passage: <b>작곡</b> 실력이, <b>신동</b>이라 부르며, <b>궁정 음악가</b>로 일하게, <b>평민</b>들도 <b>공연</b>장에서, <b>교향곡</b>, <b>진혼곡</b>
        # answerKey: q3_1:신동, q3_2:궁정 음악가, q4_1:평민, q4_2:작품/곡/작곡
        'q1': '로 일하게 되었어요',  # <b>궁정 음악가</b> 뒤
        'q2': '이라 부르며 감탄을',  # <b>신동</b> 뒤
        'q3': '실력이 뛰어났고',  # <b>작곡</b> 뒤
        'q4': '들도',  # <b>평민</b> 뒤
    },
    'people2_05': {
        # passage: <b>물리학자</b>입니다, <b>천재</b>가 될 것이라고, <b>상상</b>하는 것을, <b>질문</b>을 떠올렸어요, <b>이론</b>을 발표, <b>사고 실험</b>을 통해, <b>노벨 물리학상</b>을, <b>영향력</b>
        # answerKey: q3_1:상상, q3_2:사고 실험, q4_1:이론, q4_2:노벨 물리학상
        'q1': '을 떠올렸어요',  # <b>질문</b> 뒤
        'q2': '을 발표했습니다',  # <b>이론</b> 뒤
        'q3': '하는 것을 무척 좋아했어요',  # <b>상상</b> 뒤
        'q4': '을 받았고',  # <b>노벨 물리학상</b> 뒤
    },
    'people2_06': {
        # passage: <b>노벨상</b> 수상자, <b>열정</b>을 잃지 않은, <b>도전</b> 정신이, <b>방사능</b>을 연구, <b>실험</b>을 반복, <b>원소</b>인 폴로늄, <b>발견</b>은, <b>공헌</b>을
        # answerKey: q3_1:실험, q3_2:원소, q4_1:발견, q4_2:공헌
        'q1': '인 폴로늄과 라듐을 발견했습니다',  # <b>원소</b> 뒤
        'q2': '을 잃지 않은 그녀의',  # <b>열정</b> 뒤
        'q3': '을 반복했습니다',  # <b>실험</b> 뒤
        'q4': '은 오늘날 암 치료와',  # <b>발견</b> 뒤
    },
    'people2_07': {
        # passage: <b>독립운동가</b>이자, <b>차별</b>을 받는, <b>비폭력</b>과 <b>불복종</b>이라는, <b>식민 지배</b>에 맞서, <b>평화</b>로운 저항, <b>독립</b>을 이끌어, <b>사상</b>은, <b>정의</b>의
        # answerKey: q3_1:비폭력, q3_2:불복종, q4_1:평화, q4_2:독립
        'q1': '과',  # <b>비폭력</b> 뒤
        'q2': '이라는 독특한 방법으로 저항했습니다',  # <b>불복종</b> 뒤
        'q3': '에 맞서 독립운동을 이끌었습니다',  # <b>식민 지배</b> 뒤
        'q4': '로운 저항은 결국',  # <b>평화</b> 뒤
    },
    'people2_08': {
        # passage: <b>헬리콥터</b> 장난감이, <b>비행</b> 연구를, <b>실패</b>를 거듭, <b>개선</b>했어요, <b>풍동</b>, <b>실험</b>했습니다, <b>협력</b>을, <b>최초</b>의, <b>도전</b>은, <b>항공</b>
        # answerKey: q3_1:실패, q3_2:개선, q4_1:최초, q4_2:비행
        'q1': '했어요',  # <b>개선</b> 뒤
        'q2': '를 거듭했습니다',  # <b>실패</b> 뒤
        'q3': '했습니다',  # <b>실험</b> 뒤
        'q4': '의 동력 비행이었습니다',  # <b>최초</b> 뒤
    },
    'people2_09': {
        # passage: <b>시력</b>과 <b>청력</b>을 모두 잃었어요, <b>좌절</b>하고, <b>가정교사</b>를, <b>깨달음</b>의 순간이, <b>소통</b>하는 문을, <b>열정</b>이, <b>노력</b> 끝에, <b>졸업</b>한, <b>장애인</b>, <b>장애</b>도, <b>희망</b>
        # answerKey: q3_1:시력, q3_2:청력, q4_1:깨달음, q4_2:소통
        'q1': '과',  # <b>시력</b> 뒤
        'q2': '을 모두 잃었어요',  # <b>청력</b> 뒤
        'q3': '의 순간이 헬렌에게',  # <b>깨달음</b> 뒤
        'q4': '하는 문을 열어 주었어요',  # <b>소통</b> 뒤
    },
    'people2_10': {
        # passage: <b>화가</b>입니다, <b>천직</b>이 그림이라는, <b>열정</b>적이었고, <b>감정</b>을 그대로, <b>불운</b>한, <b>외로움</b>과, <b>걸작</b>들입니다, <b>혁신</b>적이고, <b>교훈</b>을, <b>가치</b>는
        # answerKey: q3_1:천직, q3_2:열정, q4_1:혁신, q4_2:걸작
        'q1': '이 그림이라는 것을',  # <b>천직</b> 뒤
        'q2': '적이었고',  # <b>열정</b> 뒤
        'q3': '적이고 아름다운지',  # <b>혁신</b> 뒤
        'q4': '들입니다',  # <b>걸작</b> 뒤
    },
    'people2_11': {
        # passage: <b>간호사</b>는, <b>소명</b>이라고, <b>헌신</b>은, <b>직업</b>으로, <b>위생</b> 상태가, <b>간호</b>했는데, <b>통계</b>는, <b>전문</b> 간호, <b>업적</b>은
        # answerKey: q3_1:위생, q3_2:통계, q4_1:소명, q4_2:헌신
        'q1': '상태가 나빠',  # <b>위생</b> 뒤
        'q2': '는 위생의 중요성을',  # <b>통계</b> 뒤
        'q3': '이라고 믿었습니다',  # <b>소명</b> 뒤
        'q4': '은 곧 많은 사람들에게',  # <b>헌신</b> 뒤
    },
    'people2_12': {
        # passage: <b>발명가</b>입니다, <b>호기심</b>이, <b>전구</b>를 발명, <b>실패</b>라고 말하지, <b>실험</b>을 거듭, <b>성공</b>했습니다, <b>특허</b>를, <b>노력</b>
        # answerKey: q3_1:실패, q3_2:실험, q4_1:전구, q4_2:특허
        'q1': '를 발명하기 위해',  # <b>전구</b> 뒤
        'q2': '라고 말하지 않았어요',  # <b>실패</b> 뒤
        'q3': '을 거듭했습니다',  # <b>실험</b> 뒤
        'q4': '를 받았습니다',  # <b>특허</b> 뒤
    },
    'people2_13': {
        # passage: <b>군인</b>이자, <b>전략</b>의, <b>황제</b>가, <b>개혁</b>을, <b>법전</b>을, <b>정복</b>에, <b>야망</b>은, <b>몰락</b>하고
        # answerKey: q3_1:황제, q3_2:법전, q4_1:정복, q4_2:야망
        'q1': '가 되었습니다',  # <b>황제</b> 뒤
        'q2': '을 만들었습니다',  # <b>법전</b> 뒤
        'q3': '에 집착하여',  # <b>정복</b> 뒤
        'q4': '은 결국 그를',  # <b>야망</b> 뒤
    },
    'people2_14': {
        # passage: <b>음악가</b>입니다, <b>청력</b>을 잃기, <b>작곡</b>을 계속, <b>교향곡</b>을, <b>역경</b>을, <b>불굴</b>의, <b>열정</b>과, <b>희망</b>의
        # answerKey: q3_1:청력, q3_2:교향곡, q4_1:역경, q4_2:불굴
        'q1': '을 잃기 시작했어요',  # <b>청력</b> 뒤
        'q2': '을 완성했습니다',  # <b>교향곡</b> 뒤
        'q3': '을 이겨내고',  # <b>역경</b> 뒤
        'q4': '의 의지로',  # <b>불굴</b> 뒤
    },
    'people2_15': {
        # passage: <b>철학자</b>이자, <b>사상가</b>입니다, <b>인(仁)</b>이라고, <b>예(禮)</b>를, <b>제자</b>들에게, <b>교육</b>을, <b>덕(德)</b>으로, <b>성인</b>으로
        # answerKey: q3_1:인(仁)/인, q3_2:예(禮)/예, q4_1:교육, q4_2:덕(德)/덕
        'q1': '이라고 가르쳤습니다',  # <b>인(仁)</b> 뒤
        'q2': '를 갖추어야',  # <b>예(禮)</b> 뒤
        'q3': '을 강조했습니다',  # <b>교육</b> 뒤
        'q4': '으로 다스려야',  # <b>덕(德)</b> 뒤
    },
    'people2_16': {
        # passage: <b>철학자</b>입니다, <b>이데아</b>라고, <b>그림자</b>에, <b>동굴</b>의, <b>진리</b>를, <b>교육</b>의, <b>이성</b>으로, <b>아카데미아</b>를
        # answerKey: q3_1:이데아, q3_2:그림자, q4_1:동굴, q4_2:진리
        'q1': '라고 불렀습니다',  # <b>이데아</b> 뒤
        'q2': '에 불과하다고',  # <b>그림자</b> 뒤
        'q3': '의 비유를 통해',  # <b>동굴</b> 뒤
        'q4': '를 찾아야',  # <b>진리</b> 뒤
    },
    'people2_17': {
        # passage: <b>사상가</b>이자, <b>계몽주의</b>의, <b>자유</b>와, <b>평등</b>, <b>사회 계약론</b>을, <b>인민주권</b>의, <b>교육</b>에, <b>민주주의</b>의
        # answerKey: q3_1:자유, q3_2:평등, q4_1:사회 계약론, q4_2:인민주권
        'q1': '와',  # <b>자유</b> 뒤
        'q2': '을 주장했습니다',  # <b>평등</b> 뒤 (없으면 다른 곳)
        'q3': '을 썼습니다',  # <b>사회 계약론</b> 뒤
        'q4': '의 원리를',  # <b>인민주권</b> 뒤
    },
    'people2_18': {
        # passage: <b>경제학자</b>입니다, <b>국부론</b>을, <b>분업</b>의, <b>시장</b>이, <b>보이지 않는 손</b>이라고, <b>자유무역</b>을, <b>자본주의</b>의, <b>경제학</b>의
        # answerKey: q3_1:국부론, q3_2:분업, q4_1:시장, q4_2:보이지 않는 손
        'q1': '을 발표했습니다',  # <b>국부론</b> 뒤
        'q2': '의 효과를',  # <b>분업</b> 뒤
        'q3': '이 스스로 조절된다고',  # <b>시장</b> 뒤
        'q4': '이라고 표현했습니다',  # <b>보이지 않는 손</b> 뒤
    },
    'people2_19': {
        # passage: <b>박물학자</b>입니다, <b>비글호</b>를, <b>관찰</b>했습니다, <b>진화론</b>을, <b>자연선택</b>이라고, <b>종의 기원</b>을, <b>논쟁</b>을, <b>과학</b>의
        # answerKey: q3_1:진화론, q3_2:자연선택, q4_1:종의 기원, q4_2:과학
        'q1': '을 발표했습니다',  # <b>진화론</b> 뒤
        'q2': '이라고 불렀습니다',  # <b>자연선택</b> 뒤
        'q3': '을 출판했습니다',  # <b>종의 기원</b> 뒤
        'q4': '의 역사를 바꾸었습니다',  # <b>과학</b> 뒤
    },
    'people2_20': {
        # passage: <b>심리학자</b>입니다, <b>무의식</b>의, <b>정신분석</b>을, <b>꿈</b>의, <b>자아</b>와, <b>오이디푸스 콤플렉스</b>라는, <b>치료</b>법을, <b>심리학</b>의
        # answerKey: q3_1:무의식, q3_2:정신분석, q4_1:꿈, q4_2:자아
        'q1': '의 세계를',  # <b>무의식</b> 뒤
        'q2': '을 창시했습니다',  # <b>정신분석</b> 뒤
        'q3': '의 해석을 통해',  # <b>꿈</b> 뒤
        'q4': '와 초자아',  # <b>자아</b> 뒤
    },
    'people2_21': {
        # passage: <b>물리학자</b>입니다, <b>중력</b>의, <b>사과</b>가, <b>운동 법칙</b>을, <b>미적분</b>을, <b>광학</b>의, <b>과학</b>의
        # answerKey: 확인 필요
        'q1': '의 법칙을 발견했습니다',  # <b>중력</b> 뒤
        'q2': '가 떨어지는 것을 보고',  # <b>사과</b> 뒤
        'q3': '을 정립했습니다',  # <b>운동 법칙</b> 뒤
        'q4': '을 발명했습니다',  # <b>미적분</b> 뒤
    },
    'people2_22': {
        # passage: <b>탐험가</b>입니다, <b>항해</b>를, <b>신대륙</b>을, <b>원주민</b>들을, <b>교류</b>가, <b>식민지</b>의
        # answerKey: 확인 필요
        'q1': '를 시작했습니다',  # <b>항해</b> 뒤
        'q2': '을 발견했습니다',  # <b>신대륙</b> 뒤
        'q3': '들을 만났습니다',  # <b>원주민</b> 뒤
        'q4': '가 시작되었습니다',  # <b>교류</b> 뒤
    },
    'people2_23': {
        # passage: <b>왕</b>입니다, <b>세종대왕</b>은, <b>한글</b>을, <b>백성</b>들이, <b>과학</b>과, <b>농업</b>을, <b>업적</b>
        # answerKey: 확인 필요
        'q1': '을 창제했습니다',  # <b>한글</b> 뒤
        'q2': '들이 쉽게',  # <b>백성</b> 뒤
        'q3': '과 기술의 발전을',  # <b>과학</b> 뒤
        'q4': '을 장려했습니다',  # <b>농업</b> 뒤
    },
    'people2_24': {
        # passage: <b>장군</b>입니다, <b>임진왜란</b>이, <b>거북선</b>을, <b>학익진</b>이라는, <b>전투</b>에서, <b>나라</b>를, <b>충무공</b>이라는
        # answerKey: 확인 필요
        'q1': '을 만들었습니다',  # <b>거북선</b> 뒤
        'q2': '이라는 전술을 사용했습니다',  # <b>학익진</b> 뒤
        'q3': '에서 승리했습니다',  # <b>전투</b> 뒤
        'q4': '를 지켰습니다',  # <b>나라</b> 뒤
    },
    'people2_25': {
        # passage: <b>독립운동가</b>입니다, <b>만세운동</b>이, <b>독립선언서</b>를, <b>태극기</b>를, <b>민족</b>의, <b>희생</b>
        # answerKey: 확인 필요
        'q1': '이 일어났습니다',  # <b>만세운동</b> 뒤
        'q2': '를 낭독했습니다',  # <b>독립선언서</b> 뒤
        'q3': '를 들고',  # <b>태극기</b> 뒤
        'q4': '의 독립을 외쳤습니다',  # <b>민족</b> 뒤
    },
    'people2_26': {
        # passage: <b>의사</b>입니다, <b>독립운동</b>에, <b>의거</b>를, <b>폭탄</b>을, <b>순국</b>했습니다, <b>영웅</b>으로
        # answerKey: 확인 필요
        'q1': '에 뛰어들었습니다',  # <b>독립운동</b> 뒤
        'q2': '를 결행했습니다',  # <b>의거</b> 뒤
        'q3': '을 던졌습니다',  # <b>폭탄</b> 뒤
        'q4': '했습니다',  # <b>순국</b> 뒤
    },
    'people2_27': {
        # passage: <b>시인</b>입니다, <b>저항시</b>를, <b>별</b>을, <b>하늘</b>과, <b>민족</b>의, <b>서시</b>라는
        # answerKey: 확인 필요
        'q1': '를 썼습니다',  # <b>저항시</b> 뒤
        'q2': '을 헤어 봅니다',  # <b>별</b> 뒤 (서시 구절)
        'q3': '과 바람과',  # <b>하늘</b> 뒤
        'q4': '의 아픔을 노래했습니다',  # <b>민족</b> 뒤
    },
    'people2_28': {
        # passage: <b>과학자</b>입니다, <b>연구</b>를, <b>유전자</b>의, <b>DNA</b>의, <b>발견</b>은, <b>의학</b>의
        # answerKey: 확인 필요
        'q1': '를 했습니다',  # <b>연구</b> 뒤
        'q2': '의 비밀을 밝혔습니다',  # <b>유전자</b> 뒤
        'q3': '의 구조를 발견했습니다',  # <b>DNA</b> 뒤
        'q4': '은 의학 발전에 기여했습니다',  # <b>발견</b> 뒤
    },
    'people2_29': {
        # passage: <b>사업가</b>입니다, <b>혁신</b>을, <b>스마트폰</b>을, <b>디자인</b>과, <b>기술</b>의, <b>창의력</b>
        # answerKey: 확인 필요
        'q1': '을 추구했습니다',  # <b>혁신</b> 뒤
        'q2': '을 만들었습니다',  # <b>스마트폰</b> 뒤
        'q3': '과 기술을 결합했습니다',  # <b>디자인</b> 뒤
        'q4': '의 발전을 이끌었습니다',  # <b>기술</b> 뒤
    },
    'people2_30': {
        # passage: <b>지도자</b>입니다, <b>인종차별</b>에, <b>투쟁</b>을, <b>감옥</b>에서, <b>대통령</b>이, <b>화해</b>와
        # answerKey: 확인 필요
        'q1': '에 맞서 싸웠습니다',  # <b>인종차별</b> 뒤
        'q2': '을 벌였습니다',  # <b>투쟁</b> 뒤
        'q3': '에서 27년을 보냈습니다',  # <b>감옥</b> 뒤
        'q4': '이 되었습니다',  # <b>대통령</b> 뒤
    },
    'people2_31': {
        # passage: <b>수녀</b>입니다, <b>가난</b>한, <b>봉사</b>를, <b>사랑</b>을, <b>평화</b>상을, <b>성인</b>으로
        # answerKey: 확인 필요
        'q1': '한 이들을 도왔습니다',  # <b>가난</b> 뒤
        'q2': '를 실천했습니다',  # <b>봉사</b> 뒤
        'q3': '을 나누었습니다',  # <b>사랑</b> 뒤
        'q4': '상을 받았습니다',  # <b>평화</b> 뒤
    },
    'people2_32': {
        # passage: <b>운동선수</b>입니다, <b>차별</b>에, <b>야구</b>를, <b>메이저리그</b>에서, <b>인종</b>의, <b>용기</b>
        # answerKey: 확인 필요
        'q1': '에 맞서 싸웠습니다',  # <b>차별</b> 뒤
        'q2': '를 사랑했습니다',  # <b>야구</b> 뒤
        'q3': '에서 활약했습니다',  # <b>메이저리그</b> 뒤
        'q4': '의 벽을 허물었습니다',  # <b>인종</b> 뒤
    },
    'people2_33': {
        # passage: <b>우주비행사</b>입니다, <b>달</b>에, <b>아폴로 11호</b>를, <b>역사</b>에, <b>인류</b>의, <b>도전</b>
        # answerKey: 확인 필요
        'q1': '에 첫 발을 디뎠습니다',  # <b>달</b> 뒤
        'q2': '를 타고',  # <b>아폴로 11호</b> 뒤
        'q3': '에 남을',  # <b>역사</b> 뒤
        'q4': '의 위대한 도전이었습니다',  # <b>인류</b> 뒤
    },
    'people2_34': {
        # passage: <b>작가</b>입니다, <b>상상력</b>으로, <b>마법</b>의, <b>해리포터</b>를, <b>실패</b>를, <b>성공</b>
        # answerKey: 확인 필요
        'q1': '으로 세계를 창조했습니다',  # <b>상상력</b> 뒤
        'q2': '의 세계를 만들었습니다',  # <b>마법</b> 뒤
        'q3': '를 썼습니다',  # <b>해리포터</b> 뒤
        'q4': '를 딛고 일어섰습니다',  # <b>실패</b> 뒤
    },
    'people2_35': {
        # passage: <b>영화감독</b>입니다, <b>스토리</b>와, <b>애니메이션</b>을, <b>상상력</b>으로, <b>자연</b>과, <b>메시지</b>
        # answerKey: 확인 필요
        'q1': '와 감동을',  # <b>스토리</b> 뒤
        'q2': '을 만들었습니다',  # <b>애니메이션</b> 뒤
        'q3': '으로 세계를 그렸습니다',  # <b>상상력</b> 뒤
        'q4': '과 환경의',  # <b>자연</b> 뒤
    },
    'people2_36': {
        # passage: <b>발명가</b>입니다, <b>전기</b>와, <b>교류</b>를, <b>무선통신</b>의, <b>상상력</b>과, <b>미래</b>를
        # answerKey: 확인 필요
        'q1': '와 자기장을',  # <b>전기</b> 뒤
        'q2': '를 발명했습니다',  # <b>교류</b> 뒤
        'q3': '의 기초를 닦았습니다',  # <b>무선통신</b> 뒤
        'q4': '과 호기심으로',  # <b>상상력</b> 뒤
    },
    'people2_37': {
        # passage: <b>과학자</b>입니다, <b>컴퓨터</b>의, <b>인공지능</b>의, <b>튜링 테스트</b>를, <b>암호</b>를, <b>천재</b>
        # answerKey: 확인 필요
        'q1': '의 아버지로 불립니다',  # <b>컴퓨터</b> 뒤
        'q2': '의 개념을 제시했습니다',  # <b>인공지능</b> 뒤
        'q3': '를 만들었습니다',  # <b>튜링 테스트</b> 뒤
        'q4': '를 해독했습니다',  # <b>암호</b> 뒤
    },
    'people2_38': {
        # passage: <b>환경운동가</b>입니다, <b>기후변화</b>에, <b>시위</b>를, <b>행동</b>에, <b>미래</b>를, <b>젊은이</b>들에게
        # answerKey: 확인 필요
        'q1': '에 맞서 목소리를 높였습니다',  # <b>기후변화</b> 뒤
        'q2': '를 시작했습니다',  # <b>시위</b> 뒤
        'q3': '에 나설 것을 촉구했습니다',  # <b>행동</b> 뒤
        'q4': '를 위해 싸웁니다',  # <b>미래</b> 뒤
    },
    'people2_39': {
        # passage: <b>물리학자</b>입니다, <b>블랙홀</b>의, <b>시간</b>의, <b>장애</b>를, <b>우주</b>의, <b>호기심</b>
        # answerKey: 확인 필요
        'q1': '의 비밀을 연구했습니다',  # <b>블랙홀</b> 뒤
        'q2': '의 역사를 썼습니다',  # <b>시간</b> 뒤
        'q3': '를 극복하고',  # <b>장애</b> 뒤
        'q4': '의 신비를 밝혔습니다',  # <b>우주</b> 뒤
    },
    'people2_40': {
        # passage: <b>기업가</b>입니다, <b>우주</b>를, <b>화성</b>에, <b>로켓</b>을, <b>혁신</b>을, <b>미래</b>를
        # answerKey: 확인 필요
        'q1': '를 꿈꿉니다',  # <b>우주</b> 뒤
        'q2': '에 인류를',  # <b>화성</b> 뒤
        'q3': '을 만들었습니다',  # <b>로켓</b> 뒤
        'q4': '을 추구합니다',  # <b>혁신</b> 뒤
    },
}

# ============================================
# Part 2: CSS 및 함수 정의
# ============================================

evidence_css = '''/* === 정답 근거 하이라이트 스타일 === */
.evidence-highlight {
  padding: 1px 2px;
  border-radius: 3px;
  position: relative;
  display: inline;
  margin: 0 1px;
}
.evidence-highlight:hover {
  filter: brightness(0.95);
}
.evidence-highlight .evidence-tag {
  display: inline-block;
  font-size: 10px;
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 2px;
  vertical-align: super;
  font-weight: bold;
}

.evidence-q1 { background: linear-gradient(180deg, transparent 60%, rgba(255, 182, 193, 0.6) 40%); }
.evidence-q1:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 150, 170, 0.8) 40%); }
.evidence-q1 .evidence-tag { background: #e91e63; }

.evidence-q2 { background: linear-gradient(180deg, transparent 60%, rgba(173, 216, 230, 0.6) 40%); }
.evidence-q2:hover { background: linear-gradient(180deg, transparent 40%, rgba(140, 190, 220, 0.8) 40%); }
.evidence-q2 .evidence-tag { background: #2196f3; }

.evidence-q3 { background: linear-gradient(180deg, transparent 60%, rgba(144, 238, 144, 0.6) 40%); }
.evidence-q3:hover { background: linear-gradient(180deg, transparent 40%, rgba(100, 210, 100, 0.8) 40%); }
.evidence-q3 .evidence-tag { background: #4caf50; }

.evidence-q4 { background: linear-gradient(180deg, transparent 60%, rgba(255, 218, 185, 0.6) 40%); }
.evidence-q4:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 190, 140, 0.8) 40%); }
.evidence-q4 .evidence-tag { background: #ff9800; }

.evidence-q5 { background: linear-gradient(180deg, transparent 60%, rgba(221, 160, 221, 0.6) 40%); }
.evidence-q5:hover { background: linear-gradient(180deg, transparent 40%, rgba(200, 130, 200, 0.8) 40%); }
.evidence-q5 .evidence-tag { background: #9c27b0; }

'''

highlight_functions = '''
// === 정답 근거 하이라이트 함수 ===
function clearEvidenceHighlights() {
  const areas = [document.querySelector('.passage-text'), document.getElementById('vocab-result')];
  areas.forEach(area => {
    if (!area) return;
    const highlights = Array.from(area.querySelectorAll('.evidence-highlight'));
    highlights.forEach(el => {
      const text = el.textContent.replace(/\\d번$/, '');
      el.replaceWith(document.createTextNode(text));
    });
    area.normalize();
  });
}

function highlightEvidence() {
  const pack = window.CONTENTS?.[window.CUR_UNIT];
  if (!pack || !pack.explain) return;
  clearEvidenceHighlights();
  const qLabels = { q1: '1번', q2: '2번', q3: '3번', q4: '4번', q5: '5번' };
  const areas = [document.querySelector('.passage-text'), document.getElementById('vocab-result')];

  ['q1', 'q2', 'q3', 'q4'].forEach(qKey => {
    const evidenceText = pack.explain[qKey];
    if (!evidenceText || evidenceText.length < 2) return;

    const chars = Array.from(evidenceText);
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
    const flexPattern = escapedChars.join('(?:<[^>]*>)*');

    areas.forEach(area => {
      if (!area) return;
      try {
        const regex = new RegExp(`(${flexPattern})`, 'g');
        const html = area.innerHTML;
        const newHtml = html.replace(regex,
          `<span class="evidence-highlight evidence-${qKey}">$1<span class="evidence-tag">${qLabels[qKey]}</span></span>`);
        if (newHtml !== html) {
          area.innerHTML = newHtml;
        }
      } catch (e) {
        console.warn(`[highlightEvidence] ${qKey} 패턴 오류:`, e);
      }
    });
  });
}
window.highlightEvidence = highlightEvidence;
window.clearEvidenceHighlights = clearEvidenceHighlights;
'''

# ============================================
# Part 3: HTML 파일 수정 함수
# ============================================

def update_html_file(filepath):
    """HTML 파일에 하이라이트 인프라 추가"""
    if not os.path.exists(filepath):
        return f"[{os.path.basename(filepath)}] 파일 없음"

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    results = []

    # 1. CSS 추가
    if 'evidence-highlight' not in content:
        if '</style>' in content:
            content = content.replace('</style>', evidence_css + '</style>', 1)
            modified = True
            results.append("CSS 추가됨")
        else:
            results.append("</style> 태그 없음")
    else:
        results.append("CSS 이미 있음")

    # 2. resetQuiz에 clearEvidenceHighlights 추가
    if 'clearEvidenceHighlights' not in content:
        # drawRadarChart 패턴 찾기
        patterns = [
            (r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\s*\n(\s*\})\s*\n\s*(// 퀴즈 입력 활성화)",
             r'\1\n\n      // ★ 정답 근거 하이라이트 제거\n      if (typeof clearEvidenceHighlights === \'function\') {\n        clearEvidenceHighlights();\n      }\n\2\n\n    \3'),
            (r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\s*\n(\s*\})\s*\n\s*(function enableQuizInputs)",
             r'\1\n\n      // ★ 정답 근거 하이라이트 제거\n      if (typeof clearEvidenceHighlights === \'function\') {\n        clearEvidenceHighlights();\n      }\n\2\n\n    \3'),
        ]

        found = False
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                modified = True
                found = True
                results.append("resetQuiz에 clearEvidenceHighlights 추가됨")
                break

        if not found:
            results.append("resetQuiz 패턴 불일치")
    else:
        results.append("clearEvidenceHighlights 이미 있음")

    # 3. saveReadingProgress에 highlightEvidence 추가
    if 'highlightEvidence' not in content:
        pattern = r"(if \(typeof renderSolutions === 'function'\) \{\s*\n\s*const content = window\.CONTENTS\[window\.CUR_UNIT\];\s*\n\s*if \(content\) renderSolutions\(content\);\s*\n\s*\})\s*\n\s*(// showSubmitSuccess)"
        replacement = r'''\1

        // ★ 정답 근거 하이라이트 표시
        if (typeof highlightEvidence === 'function') {
          highlightEvidence();
        }

        \2'''

        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            results.append("saveReadingProgress에 highlightEvidence 추가됨")
        else:
            # 대안 패턴
            pattern2 = r"(if \(content\) renderSolutions\(content\);)\s*\n(\s*\})\s*\n\s*(// showSubmitSuccess)"
            replacement2 = r'''\1
\2

        // ★ 정답 근거 하이라이트 표시
        if (typeof highlightEvidence === 'function') {
          highlightEvidence();
        }

        \3'''
            if re.search(pattern2, content):
                content = re.sub(pattern2, replacement2, content, count=1)
                modified = True
                results.append("saveReadingProgress에 highlightEvidence 추가됨 (대안 패턴)")
            else:
                results.append("saveReadingProgress 패턴 불일치")
    else:
        results.append("highlightEvidence 이미 있음")

    # 4. 하이라이트 함수 정의 추가
    if 'function clearEvidenceHighlights' not in content:
        # </script> 앞에 추가
        patterns = [
            r"(\}\s*\n\s*\})(\s*\n</script>\s*\n+\s*<!-- 외부 JS: 단원 콘텐츠)",
            r"(\}\s*\n</script>)(\s*\n+\s*<!-- 외부 JS: 단원 콘텐츠)",
            r"(showSubmitSuccess\('[^']+'\);\s*\n\s*\})(\s*\n</script>)",
        ]

        found = False
        for pattern in patterns:
            if re.search(pattern, content):
                def repl(m):
                    return m.group(1) + highlight_functions + m.group(2)
                content = re.sub(pattern, repl, content, count=1)
                modified = True
                found = True
                results.append("하이라이트 함수 추가됨")
                break

        if not found:
            results.append("함수 정의 패턴 불일치")
    else:
        results.append("하이라이트 함수 이미 있음")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"[{os.path.basename(filepath)}] {', '.join(results)}"
    else:
        return f"[{os.path.basename(filepath)}] 변경 없음 - {', '.join(results)}"


# ============================================
# Part 4: 메인 실행
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("people2 하이라이트 구조 일괄 적용 시작")
    print("=" * 60)

    # HTML 파일 업데이트
    print("\n[HTML 파일 업데이트]")
    for i in range(2, 41):
        filename = f'people2_{i:02d}.html'
        filepath = os.path.join(base_path, filename)
        result = update_html_file(filepath)
        print(result)

    print("\n" + "=" * 60)
    print("완료!")
    print("=" * 60)
