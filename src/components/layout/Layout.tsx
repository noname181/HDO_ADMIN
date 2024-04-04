import { type PropsWithChildren } from 'react';
import { Sidebar } from 'components/layout/Sidebar';
import { Navbar } from 'components/layout/Navbar';
import { useRecoilState } from 'recoil';
import { sidebarOpenState } from 'recoil/atom/sidebarState';
import { Body, Container, ContentWrap, Content } from 'styles/style';
import { AlertModal } from 'components/common/Modal/AlertModal';

export const Layout = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sidebarOpenState);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const state = {
    isLoading: false,
    error: null,
    isSuccess: false,
  };

  return (
    <Body>
      <Container>
        <AlertModal />
        <Sidebar isOpen={isSidebarOpen} />
        <ContentWrap isOpen={isSidebarOpen}>
          <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Content>{children}</Content>
        </ContentWrap>
      </Container>
    </Body>
  );
};
