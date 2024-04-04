export const FormMail = () => {
  return (
    <>
      <div
        style={{
          width: 600,
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            height: 4,
            background: 'linear-gradient(90deg, #03A56B 0%, #0582DC 100%)',
          }}
        ></div>
        <div
          style={{
            padding: '30px 40px',
            borderBottom: '1px solid #F5F5F5',
          }}
        >
          <img
            src="https://evnu.oilbank.co.kr/assets/img/Layer_1.png"
            alt="ev&U"
            style={{ display: 'block', marginBottom: 14 }}
          />
          <img
            src="https://evnu.oilbank.co.kr/assets/img/title.png"
            alt="비밀번호 설정"
            style={{ display: 'block' }}
          />
        </div>
        <div
          style={{
            padding: '30px 40px',
            borderBottom: '1px solid #F5F5F5',
          }}
        >
          <p
            style={{
              fontSize: 24,
              lineHeight: '32px',
              color: '#03A56B',
              letterSpacing: -1,
              fontWeight: 600,
              marginBottom: 0,
            }}
          >
            EV&U 협력사 회원 가입 대기 상태입니다.
          </p>
          <p
            style={{
              fontSize: 24,
              lineHeight: '32px',
              color: '#4A4B4D',
              letterSpacing: -1,
              fontWeight: 600,
              marginBottom: 40,
            }}
          >
            아래 링크를 통해 비밀번호 설정 후 정상적으로 사용 가능합니다.
          </p>
          <div style={{ height: 117 }}>
            <button
              style={{
                background: '#03A56B',
                color: '#fff',
                border: 0,
                borderRadius: 6,
                height: 50,
                width: 224,
                marginBottom: 10,
                letterSpacing: -1,
              }}
            >
              비밀번호 설정하기
            </button>
            <p
              style={{
                color: '#F4351B',
                lineHeight: '17px',
                fontWeight: 400,
                fontSize: 14,
                margin: 0,
              }}
            >
              비밀번호 설정은 1번만 가능합니다
            </p>
          </div>
        </div>
        <div
          style={{
            background: '#F5F6F6',
            padding: '30px 40px',
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: -1,
              color: '#949596',
              margin: 0,
            }}
          >
            본 메일은 협력사 회원가입을 정상적으로 처리하기 위해 이메일 수신동의
            여부에 상관없이 발송됩니다.
          </p>
          <p
            style={{
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: -1,
              color: '#949596',
              margin: 0,
            }}
          >
            본 메일은 발송 전용으로 회신이 불가하오니, 문의사항은
            고객센터(1588-5127)를 이용해 주시기 바랍니다.
          </p>
        </div>
      </div>
    </>
  );
};
