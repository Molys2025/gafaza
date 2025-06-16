
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Search from '@/pages/Search';
import HarvesterProfile from '@/pages/HarvesterProfile';
import OwnerProfile from '@/pages/OwnerProfile';
import Messages from '@/pages/Messages';
import Payment from '@/pages/Payment';
import Evaluation from '@/pages/Evaluation';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/search" element={<Search />} />
      <Route path="/harvester-profile" element={<HarvesterProfile />} />
      <Route path="/owner-profile" element={<OwnerProfile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/evaluation" element={<Evaluation />} />
    </Routes>
  );
};

export default AppRoutes;
