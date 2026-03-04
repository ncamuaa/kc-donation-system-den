import React, { useState } from 'react'
import { useData } from './context/DataContext'
import {
  SideNav, HeaderBar,
  HomePage, CampaignsPage, CampaignDetailsPage,
  DonationPage, ThankYouPage, DashboardPage,
  TransparencyPage, ContactPage, AboutPage, LoginPage,
  CAMPAIGNS,
} from './pages'

export default function App() {
  const { logout, user, isAuthenticated } = useData()
  const [activePage, setActivePage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated)
  const [userName, setUserName] = useState(user?.name || '')
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)
  const [donations, setDonations] = useState([])
  const [lastDonation, setLastDonation] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId) || CAMPAIGNS[0]
  const recentDonationsForSelected = donations.filter((d) => d.campaignId === selectedCampaign.id)

  const handleNavigate = (pageId) => {
    if (pageId === 'logout') {
      logout()
      setIsLoggedIn(false)
      setUserName('')
      setActivePage('home')
      return
    }
    setActivePage(pageId)
  }

  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true)
    setUserName(name)
    setActivePage('dashboard')
  }

  const handleDonateStart = (campaignId) => {
    setSelectedCampaignId(campaignId)
    setActivePage('donate')
  }

  const handleViewDetails = (campaignId) => {
    setSelectedCampaignId(campaignId)
    setActivePage('campaign-details')
  }

const handleDonationSubmit = async (donation) => {
  const payload = {
    donor: donation.name,
    amount: donation.amount,
    type: donation.type === 'Monthly (Recurring)' ? 'Recurring' : 'One-time',
    campaign: donation.campaignTitle,
    channel: donation.method,
    status: 'Pending',
    notes: donation.message || '',
  };

  try {
    const res = await fetch('http://localhost:5001/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const saved = await res.json();
      setLastDonation({ ...donation, id: saved.id });
    } else {
      setLastDonation(donation);
    }
  } catch (err) {
    console.error('Donation submit error:', err);
    setLastDonation(donation);
  }

  setSelectedCampaignId(donation.campaignId);
  setActivePage('thank-you');
};
  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      <SideNav
        isLoggedIn={isLoggedIn}
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={isSidebarCollapsed}
        userName={userName}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <HeaderBar
          userName={userName}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          {activePage === 'home' && <HomePage onDonate={handleDonateStart} onViewCampaigns={() => setActivePage('campaigns')} donations={donations} />}
          {activePage === 'campaigns' && <CampaignsPage onViewDetails={handleViewDetails} onDonate={handleDonateStart} />}
          {activePage === 'campaign-details' && <CampaignDetailsPage campaign={selectedCampaign} recentDonations={recentDonationsForSelected} onDonate={handleDonateStart} />}
          {activePage === 'donate' && <DonationPage campaigns={CAMPAIGNS} selectedCampaignId={selectedCampaignId} onSubmit={handleDonationSubmit} onBackToCampaign={() => setActivePage('campaign-details')} />}
          {activePage === 'thank-you' && <ThankYouPage donation={lastDonation} onBackHome={() => setActivePage('home')} onViewCampaign={() => setActivePage('campaign-details')} />}
          {activePage === 'dashboard' && <DashboardPage donations={donations} />}
          {activePage === 'transparency' && <TransparencyPage />}
          {activePage === 'contact' && <ContactPage />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        </main>
        <footer className="border-t border-gray-200 py-4 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} Knowledge Channel Foundation · For demo purposes only
        </footer>
      </div>
    </div>
  )
}
