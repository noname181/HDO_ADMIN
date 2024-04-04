import { useEffect, useRef, useState } from 'react';
// import useClickOutside from 'components/common/Ref/UseClickOutside';
import { Container, NextSlide, PrevSlide } from './styled';
import { Carousel } from 'antd';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { DefaultDiv } from 'styles/style';
import { NoticeContent } from './NoticeContent';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from 'recoil/authState';

export const NoitcePopup = () => {
  const isLoggedIn: boolean = useRecoilValue(isLoggedInState);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const carouselRef = useRef<any>(null);
  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }
  async function fetchNotice() {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const url = `/v1/web/active/notice?type=WEB`;
    const axios = hdoInstance();
    axios
      .get(url, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((res: any) => {
        const data = res?.data?.result;
        setData(data);
        // console.log(data);
        if (data && data?.length > 0) {
          handleOpenModal();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    if (isLoggedIn && localStorage.getItem('showedNotice') !== 'true') {
      void fetchNotice();
      localStorage.setItem('showedNotice', 'true');
    }
  }, [isLoggedIn]);

  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} title="공지 팝업" close={handleCloseModal}>
          <DefaultDiv style={{ paddingBottom: 20 }}>
            <Container>
              <Carousel ref={carouselRef} dots={false}>
                {data?.map((item, index) => {
                  return <NoticeContent key={index} data={item} />;
                })}
              </Carousel>
              <PrevSlide
                onClick={handlePrev}
                hidden={currentSlideIndex === 0}
              />
              <NextSlide
                onClick={handleNext}
                hidden={currentSlideIndex === data.length - 1}
              />
            </Container>
          </DefaultDiv>
          <ModalFooter closeText="닫기" close={handleCloseModal} isOk={false} />
        </Modal>
      )}
    </>
  );
};
