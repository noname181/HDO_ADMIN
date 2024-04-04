import { Routes, Route, Outlet } from 'react-router-dom';

import DashboardContainer from 'pages/dashboard/DashboardContainer';
import { Layout } from 'components/layout/Layout';
// import { UnitPriceManage } from './charger/chargerUPP/UnitPriceManage';
import UnitPrice from 'pages/charger/unitPrice/UnitPrice';
// Master 관리
import CodeLookUpPage from 'pages/master/CodeLookUpPage';
import ParameterPage from 'pages/master/ParameterPage';
import ErrorCodePage from 'pages/master/ErrorCodePage';
import ChargerModelPage from 'pages/master/ChargerModelPage';
// import UpdateFileManage from 'pages/master/UpdateFilePage';

// Affiliation 관리
import StationPage from 'pages/affiliation/StationPage';
import ClientPage from 'pages/affiliation/ClientPage';
import ContractorPage from 'pages/affiliation/ContractorPage';

// Charger 관리
import ChargingStationPage from 'pages/charger/chargingStation/ChargingStationPage';

import ChargerPage from 'pages/charger/ChargerPage';

// User 관리
import MobileUserPage from './Users/MobileUserPage';
import HDOAdminPage from './Users/HDOAdminPage';
import ExternalAdmin from './Users/ExternalAdminPage';
import PermissionAdmin from './Users/PermissionAdminPage';

// import { CheckingPage } from './charger/checking/CheckingPage';
import UpdateFilePage from './master/UpdateFilePage';
import { ChargerUpdatePage } from './charger/ChargerUpdatePage';

import { NoticePage } from 'pages/app/notice/NoticePage';
import { FaqPage } from 'pages/app/faq/FaqPage';
import { BannerEventPage } from 'pages/app/banner-event/BannerEventPage';
import { TermsPolicyPage } from 'pages/app/terms-policy/TermsPolicyPage';

import { InquiryPage } from 'pages/app/inquiry/InquiryPage';
import { ItemPage } from 'pages/system/item/ItemPage';
import { ReviewPage } from 'pages/app/review/ReviewPage';
import { SettlementPage } from 'pages/calculate/settlement/SettlementPage';
import { DailyPaymentPage } from 'pages/calculate/daily-payment/DailyPaymentPage';
import { MonthlySettlementPage } from 'pages/calculate/monthly-settlement/MonthlySettlementPage';

// 임시
import TroubleReport from './charger/trouble-report/TroubleReport';
// import { Admin } from './Users/Admin';
import PaymentHistory from 'pages/charger/payment/PaymentHistory';
import PaymentDetails from 'pages/charger/payment/PaymentDetails';

import ChargingDataPage from './system/chargingData/ChargingDataPage';
// import ChargerPayment from './charger/chagerPayment/ChagerPayment';
import { BonusCardPage } from './addedService/bonusCard/BonusCardPage';
import { CarWashPage } from './addedService/carWash/CarWashPage';
import { CouponPage } from './addedService/coupon/CouponPage';
import { StatsPage } from './addedService/stats/StatsPage';
import { ProductPage } from './addedService/product/ProductPage';
import { ReservationPage } from './addedService/reservation/ReservationPage';
import UnexportedPayment from './charger/unexportedPayment/UnexportedPayment';
import ChargerStatus from './charger/chargerStatus/ChargerStatus';
import Point from './addedService/point/Point';
import ChargerHistory from 'pages/history/ChargerHistory';
// import CSMain from './cs/CSHome/CSMain';
import CSHome from './cs/CSHome/CSHome';
import CSCallLog from './cs/callLog/CSCallLog';
// import CSRegMain from './cs/CSHome/CSRegMain';
import AsConsultation from './cs/AS/AsConsultation';
// import { WebsocketClient } from './cs/WebsocketClient';
import { ChargingLogPage } from './chargingLog/ChargingLogPage';
import LogHistoryPage from './chargingLog/LogHistory/LogHistoryPage';
import MessageLogPage from './chargingLog/MessageLog/MessageLogPage';
import ChargerStatusHistoryPage from './chargingLog/chargerStatusHistory/ChargerStatusHistoryPage';
import ChargerErrorHistoryPage from './chargingLog/chargerErrorHistory/ChargerErrorHistoryPage';

import { Template } from './cs/template/Template';
import OutstandingPayment from './history/OutstandingPayment';
import { SettlementDetailPage } from './calculate/settlement/detail/SettlementDetailPage';
import { DailyPaymentDetailPage } from './calculate/daily-payment/detail/DailyPaymentDetailPage';
import { MonthlyPaymentDetailPage } from './calculate/monthly-settlement/detail/MonthlyPaymentDetailPage';
import BatchLogPage from './chargingLog/BatchLog/BatchLogPage';
import { ChargerDiagnosticPage } from './chargingLog/ChargerDiagnostic/ChargerDiagnosticPage';
import { NoticePopUpPage } from './app/noticePopup/NoticePopUpPage';
import ConfigLogPage from './chargingLog/ConfigLog/ConfigLogPage';
import { CSDashboard } from './cs/csDashboard/CSDashboard';
import Statistics from './cs/statistics/Statistics';
import PaymentLogPage from './chargingLog/PaymentLog/PaymentLogPage';

const PageRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardContainer />} />
        {/* <Route path="/member" element={<MemberPage />} /> */}
        <Route path="/admin" element={<HDOAdminPage />} />
        <Route path="/external-admin" element={<ExternalAdmin />} />
        <Route path="/permission-admin" element={<PermissionAdmin />} />
        <Route path="/mobile-user" element={<MobileUserPage />} />
        <Route path="/charging-station" element={<ChargingStationPage />} />
        <Route path="/charger" element={<ChargerPage />} />
        <Route path="/station" element={<StationPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/contractor" element={<ContractorPage />} />
        <Route path="/parameter" element={<ParameterPage />} />
        <Route path="/error-code" element={<ErrorCodePage />} />
        <Route path="/codelookup" element={<CodeLookUpPage />} />
        <Route path="/charger-model" element={<ChargerModelPage />} />
        {/* <Route path="/charging-unit-price" element={<UnitPriceManage />} /> */}
        <Route path="/charging-unit-price" element={<UnitPrice />} />
        <Route path="/update-file" element={<UpdateFilePage />} />
        <Route path="/charger-update" element={<ChargerUpdatePage />} />
        <Route path="/trouble-report" element={<TroubleReport />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice-popup" element={<NoticePopUpPage />} />

        <Route path="/faq" element={<FaqPage />} />
        <Route path="/banner-event" element={<BannerEventPage />} />
        <Route path="/terms-policy" element={<TermsPolicyPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="payment-history" element={<PaymentHistory />} />
        <Route path="payment-details" element={<PaymentDetails />} />
        <Route path="/item" element={<ItemPage />} />
        <Route path="/charging-data" element={<ChargingDataPage />} />
        <Route path="/point" element={<Point />} />
        {/* <Route path="/charger-payment" element={<ChargerPayment />} /> */}
        <Route path="/bonus-card" element={<BonusCardPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/unexported-payment" element={<UnexportedPayment />} />
        <Route path="/car-wash" element={<CarWashPage />} />
        <Route path="/added-service-stats" element={<StatsPage />} />
        <Route path="/added-service-product" element={<ProductPage />} />
        <Route path="/charger-status" element={<ChargerStatus />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/charger-history" element={<ChargerHistory />} />
        <Route path="/as-consultation" element={<AsConsultation />} />
        <Route path="/cs-home" element={<CSHome />} />
        <Route path="/cs-call-log" element={<CSCallLog />} />
        <Route path="/settlement" element={<SettlementPage />} />
        <Route path="/settlement/:id" element={<SettlementDetailPage />} />
        <Route path="/daily-payment" element={<DailyPaymentPage />} />
        <Route path="/daily-payment/:id" element={<DailyPaymentDetailPage />} />
        <Route path="/monthly-settlement" element={<MonthlySettlementPage />} />
        <Route
          path="/monthly-settlement/:id"
          element={<MonthlyPaymentDetailPage />}
        />
        <Route path="/log" element={<ChargingLogPage />} />
        <Route path="/log-history" element={<LogHistoryPage />} />
        <Route path="/message-log" element={<MessageLogPage />} />
        <Route path="/template" element={<Template />} />
        <Route path="/outstanding-payment" element={<OutstandingPayment />} />
        {/* <Route
          path="/charger-status-history"
          element={<ChargerStatusHistoryPage />}
        /> */}
        <Route
          path="/charger-error-history"
          element={<ChargerErrorHistoryPage />}
        />
        <Route path="/batch-log" element={<BatchLogPage />} />
        <Route path="/charger-diagnostic" element={<ChargerDiagnosticPage />} />
        <Route path="/config-log" element={<ConfigLogPage />} />
        <Route path="/cs-dashboard" element={<CSDashboard />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/charging-log" element={<ChargerStatusHistoryPage />} />
        <Route path="/payment-log" element={<PaymentLogPage />} />
      </Routes>
    </Layout>
  );
};

export default PageRouter;
