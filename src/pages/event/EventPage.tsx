import { useState, useEffect } from 'react';
import { Body, Container, Spinner } from 'styles/style';
import { EventContent, EventCard } from './styled';
import { TabMenu, TabMenuTitle } from 'pages/login/LoginPage.styled';
import { hdoInstance } from 'apis/hdoInstance';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
interface IEvent {
  data: OrganizationInterface[];
  isApplied: boolean;
  isLoading: boolean;
}
const EventContentProcess = ({ data, isApplied, isLoading }: IEvent) => {
  const navigate = useNavigate();
  const handleClick = (data: any) => {
    if (data?.option === '제휴') {
      // console.log('aaa');
      window.open(data?.url as string);
    } else {
      navigate(`/event-detail?id=${data?.id as string}`);
    }
  };
  return (
    <>
      <EventContent>
        <div
          className="nl-event__list"
          style={{ height: 'calc(100vh - 355px)' }}
        >
          {isLoading && <Spinner />}
          {isApplied && (
            <p className="nl-event-note">
              <img
                className="nl-icon"
                src="/assets/img/icon/icon_info.png"
                alt="icon-note"
              />
              <span className="nl-text">
                조회 시점부터 직전 1년간 이벤트 응모이력만 조회 가능합니다.
              </span>
            </p>
          )}
          {!isLoading && data?.length < 0 ? (
            <div className="nl-empty">No data</div>
          ) : (
            data?.map((item: any) => {
              return (
                <div
                  key={item?.id}
                  className="nl-event__item"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="nl-event__date">
                    {!isApplied
                      ? String(item?.startdate) + ' ~ ' + String(item?.enddate)
                      : String(item?.enddate) + ' 이벤트 종료'}
                  </p>
                  <div className="nl-event__banner_frame">
                    <img
                      src={item?.image}
                      alt="banner"
                      onClick={() => {
                        handleClick(item);
                      }}
                    />
                    {isApplied && (
                      <div className="nl-mark-layer">
                        <p className="nl-mark-status applied">완료</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </EventContent>
    </>
  );
};
const EventPage = () => {
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [data, setData] = useState<OrganizationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toggleTabs = () => {
    setIsApplied((prevValue) => !prevValue);
    setData([]);
  };
  async function getData() {
    setIsLoading(true);
    const url = `/v1/banner`;
    const axios = hdoInstance();
    axios
      .get(url)
      .then((respones) => {
        // console.log(respones);
        const currentDateTime = new Date();
        const newData = isApplied
          ? respones?.data?.result?.filter(
              (item: { enddate: string | number | Date }) =>
                new Date(item?.enddate as string) <= currentDateTime,
            )
          : respones?.data?.result?.filter(
              (item: { enddate: string | number | Date }) =>
                new Date(item?.enddate) > currentDateTime,
            );
        setData(newData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'error',
          content: error.message,
        });
        setIsLoading(false);
      });
  }
  useEffect(() => {
    void getData();
  }, [isApplied]);
  return (
    <Body>
      <Container>
        <EventCard>
          <h1 className="nl-event-card__title">이벤트</h1>
          <TabMenu>
            <TabMenuTitle
              active={!isApplied}
              onClick={() => {
                toggleTabs();
              }}
            >
              진행중 이벤트
            </TabMenuTitle>
            <TabMenuTitle
              active={isApplied}
              onClick={() => {
                toggleTabs();
              }}
            >
              완료된 이벤트
            </TabMenuTitle>
          </TabMenu>
          <EventContentProcess
            data={data}
            isApplied={isApplied}
            isLoading={isLoading}
          />
        </EventCard>
      </Container>
    </Body>
  );
};
export default EventPage;
