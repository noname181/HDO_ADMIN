import { useState, useEffect } from 'react';
import { Body, Container, DefaultDiv, Spinner } from 'styles/style';
import { EventContent, EventCard } from './styled';
import { TabMenu, TabMenuTitle } from 'pages/login/LoginPage.styled';
import { hdoInstance } from 'apis/hdoInstance';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const EventDetailPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<OrganizationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const navigate = useNavigate();
  // console.log(searchParams);
  async function getData() {
    if (!searchParams.get('id')) {
      return;
    }
    setIsLoading(true);
    const url = `/v1/banner/${searchParams.get('id') as string}`;
    const axios = hdoInstance();
    axios
      .get(url)
      .then((respones) => {
        // console.log(respones?.data?.result);
        setData(respones?.data?.result?.secondaryImage);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'error',
          content: error.message,
        });
      });
  }
  useEffect(() => {
    void getData();
  }, [searchParams]);
  const handleBack = () => {
    navigate('/event');
  };
  return (
    <Body>
      <Container>
        <EventCard>
          <button className="nl-btn-back" onClick={handleBack}>
            <img src="/assets/img/icon/icon-page-prev-d.png" alt="back" />
          </button>
          <h1 className="nl-event-card__title">이벤트</h1>
          <EventContent>
            <div
              className="nl-event__list"
              style={{ height: 'calc(100vh - 292px)' }}
            >
              {isLoading && <Spinner />}
              {data?.length <= 0 ? (
                <div className="nl-empty">No data</div>
              ) : (
                data?.map((item: any, index: any) => {
                  return (
                    <div key={item?.id} className="nl-event__item">
                      <div className="nl-event__banner_frame">
                        <img src={item?.url} alt="이벤트" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </EventContent>
        </EventCard>
      </Container>
    </Body>
  );
};
export default EventDetailPage;
