import { useRef, useState } from 'react';
import useClickOutside from 'components/common/Ref/UseClickOutside';
import { NoticeBell, AlertCircle, ItemEmpty, NoticeList } from './styled';

export const Notification = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const notiRef = useRef<HTMLDivElement>(null);

  useClickOutside(notiRef, () => {
    setIsOpen(false);
  });
  return (
    <NoticeBell>
      <AlertCircle />
      <img
        src="/assets/img/icon/icon-bell.png"
        alt="알람"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: 'pointer' }}
      />
      {isOpen && (
        <NoticeList ref={notiRef}>
          <ItemEmpty>테스트 알람입니다. 테스트 알람입니다.</ItemEmpty>
        </NoticeList>
      )}
    </NoticeBell>
  );
};
