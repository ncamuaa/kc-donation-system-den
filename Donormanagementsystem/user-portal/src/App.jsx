import React, { useEffect, useState } from 'react'
import {
  Search,
  Heart,
  BarChart3,
  Bell,
  LayoutGrid,
  User,
  Megaphone,
  Mail,
   Menu,
   LogOut,
} from 'lucide-react'
import logo from './assets/image-removebg-preview.png'

const LOGGED_OUT_NAV = [
  { id: 'home', label: 'Home', icon: LayoutGrid },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'transparency', label: 'Transparency', icon: BarChart3 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'donate', label: 'Donate', icon: Heart },
  { id: 'about', label: 'About Us', icon: User },
  { id: 'auth', label: 'Login / Sign Up', icon: User },
]

const LOGGED_IN_NAV = [
  { id: 'home', label: 'Home', icon: LayoutGrid },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'dashboard', label: 'My Dashboard', icon: BarChart3 },
  { id: 'donate', label: 'Donate', icon: Heart },
  { id: 'about', label: 'About Us', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'logout', label: 'Logout', icon: LogOut },
]

const CAMPAIGNS = [
  {
    id: 'school-supplies',
    title: 'School Supplies for Learners',
    category: 'Education',
    status: 'Active',
    raised: 70000,
    goal: 100000,
    endDate: '2025-12-31',
    image:
      'https://images.pexels.com/photos/5905496/pexels-photo-5905496.jpeg?auto=compress&cs=tinysrgb&w=800',
    shortDescription:
      'Provide notebooks, pens, and learning kits to students in remote areas.',
    fullDescription:
      'This campaign focuses on delivering essential school supplies to learners in underserved communities. Your contribution helps ensure that no child is left behind because of a lack of basic educational materials.',
  },
  {
    id: 'teacher-training',
    title: 'Teacher Training Program',
    category: 'Teacher Support',
    status: 'Active',
    raised: 60000,
    goal: 80000,
    endDate: '2025-09-30',
    image:
      'https://images.pexels.com/photos/5645279/pexels-photo-5645279.jpeg?auto=compress&cs=tinysrgb&w=800',
    shortDescription:
      'Equip teachers with modern teaching strategies and digital tools.',
    fullDescription:
      'Teachers are at the heart of learning. This program offers training, workshops, and resources to help educators deliver engaging and effective lessons, both in-person and online.',
  },
  {
    id: 'educational-tv',
    title: 'Educational TV Access',
    category: 'Media',
    status: 'Completed',
    raised: 100000,
    goal: 100000,
    endDate: '2024-12-31',
    image:
      'https://images.pexels.com/photos/8219489/pexels-photo-8219489.jpeg?auto=compress&cs=tinysrgb&w=800',
    shortDescription:
      'Support the broadcast of curriculum-aligned content to more households.',
    fullDescription:
      'This initiative expands the reach of educational television content so more students can learn from home, especially in areas with limited internet access.',
  },
]

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mckhale Janry R. Natividad',
    role: 'Donor',
    quote:
      'Supporting these campaigns helped me see real impact in the lives of students.',
  },
  {
    id: 2,
    name: 'Grade 5 Learner',
    role: 'Beneficiary',
    quote:
      'Because of the learning kits, I can now study at home and follow my lessons.',
  },
]

function formatCurrency(amount) {
  return `₱${amount.toLocaleString('en-PH')}`
}

function daysLeft(endDate) {
  const now = new Date()
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'Ended'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

function useAnimatedCounter(target, duration) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const nextValue = Math.floor(target * progress)
      setValue(nextValue)
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }
    frame = requestAnimationFrame(step)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return value
}

function SideNav({ isLoggedIn, activePage, onNavigate, collapsed }) {
  const items = isLoggedIn ? LOGGED_IN_NAV : LOGGED_OUT_NAV
  const navItems = items.filter(
    (item) => item.id !== 'logout' && item.id !== 'auth',
  )
  const authItem = items.find((item) =>
    isLoggedIn ? item.id === 'logout' : item.id === 'auth',
  )

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}
    >
      <div
        className={`h-24 border-b border-gray-200 flex items-center ${
          collapsed ? 'justify-center px-0' : 'px-6'
        }`}
      >
        <img
          src={logo}
          alt="Knowledge Channel Foundation"
          className={`${collapsed ? 'h-10' : 'h-20'} w-auto object-contain`}
        />
      </div>
      <nav
        className={`flex-1 overflow-y-auto py-4 ${
          collapsed ? 'px-2' : 'px-3'
        } space-y-1`}
      >
        {navItems.map((item) => {
          const isActive = item.id === activePage
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center ${
                collapsed ? 'justify-center' : ''
              } px-3 py-2 text-sm font-medium rounded-md border-l-2 transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-transparent'
              }`}
            >
              {Icon && (
                <Icon
                  className={`h-4 w-4 ${
                    collapsed ? '' : 'mr-2'
                  } ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-blue-500'
                  }`}
                />
              )}
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-2">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => onNavigate('logout')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {authItem?.icon && (
              <authItem.icon
                className={`h-4 w-4 ${collapsed ? '' : 'mr-2'} text-gray-500`}
              />
            )}
            {!collapsed && <span>Logout</span>}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {authItem?.icon && (
              <authItem.icon
                className={`h-4 w-4 ${collapsed ? '' : 'mr-2'} text-blue-500`}
              />
            )}
            {!collapsed && <span>Login / Sign Up</span>}
          </button>
        )}
      </div>
    </aside>
  )
}

function HeaderBar({ userName, onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-3 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search donors, donations, campaigns..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <span className="mr-1">Last updated:</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
        <button
          type="button"
          className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
        </button>
        {userName && (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}

function HeroSection({ onDonate, onViewCampaigns }) {
  return (
    <section className="pt-10 pb-12 grid gap-8 md:grid-cols-2 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Support a Cause. Change a Life.
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Help bring quality learning opportunities to every Filipino child
          through community-driven, transparent, and impactful campaigns.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onDonate}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transform transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
          </button>
          <button
            type="button"
            onClick={onViewCampaigns}
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50"
          >
            View Campaigns
          </button>
        </div>
      </div>
      <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-100 mb-2">
            Featured campaign
          </p>
          <p className="text-lg font-semibold">
            School Supplies for Learners
          </p>
          <p className="mt-2 text-xs text-blue-100 max-w-xs">
            Your gifts provide essential learning kits so students can continue
            their education wherever they are.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span>₱70,000 raised</span>
            <span>70% of goal</span>
          </div>
          <div className="w-full h-2 bg-blue-900/40 rounded-full overflow-hidden">
            <div className="h-2 w-[70%] bg-amber-300 rounded-full" />
          </div>
          <p className="mt-2 text-[11px] text-blue-100">30 days left</p>
        </div>
      </div>
    </section>
  )
}

function HomeFeaturedCampaigns({ onDonate }) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Featured Campaigns
        </h2>
        <button
          type="button"
          className="text-xs text-blue-600 hover:underline"
        >
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAMPAIGNS.slice(0, 3).map((campaign) => {
          const percent = Math.round((campaign.raised / campaign.goal) * 100)
          return (
            <div
              key={campaign.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="h-28 bg-gray-100 overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {campaign.category}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaign.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {campaign.shortDescription}
                  </p>
                </div>
                <div className="mt-1">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>{formatCurrency(campaign.raised)} raised</span>
                    <span>{formatCurrency(campaign.goal)} goal</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-gray-500">
                    <span>{percent}% funded</span>
                    <span>{daysLeft(campaign.endDate)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => onDonate(campaign.id)}
                    className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ImpactStats({ stats }) {
  const funds = useAnimatedCounter(stats.totalFunds, 900)
  const donors = useAnimatedCounter(stats.totalDonors, 1000)
  const active = useAnimatedCounter(stats.activeCampaigns, 800)
  const beneficiaries = useAnimatedCounter(stats.beneficiaries, 1100)

  return (
    <section className="py-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Impact Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Total Funds Raised</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(funds)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Total Donors</p>
          <p className="text-lg font-bold text-gray-900">{donors}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Active Campaigns</p>
          <p className="text-lg font-bold text-gray-900">{active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Beneficiaries Helped</p>
          <p className="text-lg font-bold text-gray-900">{beneficiaries}</p>
        </div>
      </div>
    </section>
  )
}

function WhyDonateSection() {
  const items = [
    {
      title: 'Secure payments',
      description: 'Your donations are processed through trusted payment partners.',
    },
    {
      title: 'Transparent reporting',
      description: 'Track how every peso is allocated across campaigns.',
    },
    {
      title: 'Real impact',
      description:
        'Stories and data from beneficiaries show the difference you make.',
    },
    {
      title: 'Trusted partners',
      description:
        'We work with vetted schools, communities, and organizations nationwide.',
    },
  ]

  return (
    <section className="py-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Why donate with us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-gray-900 mb-1">
              {item.title}
            </p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Stories from our community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-xs text-gray-600 italic mb-3">“{t.quote}”</p>
            <p className="text-xs font-semibold text-gray-900">{t.name}</p>
            <p className="text-[11px] text-gray-500">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function DonorHistorySection({ donations }) {
  const recent = [...donations].slice(-5).reverse()
  const total = donations.reduce((sum, d) => sum + d.amount, 0)
  const average = donations.length ? Math.round(total / donations.length) : 0

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Donor history
            </h2>
            <span className="text-[11px] text-gray-500">
              {donations.length} donation{donations.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Donor
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Campaign
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recent.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No donations yet. Your first gift will appear here.
                    </td>
                  </tr>
                )}
                {recent.map((d) => (
                  <tr key={d.reference}>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {d.anonymous ? 'Anonymous donor' : d.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {d.campaignTitle}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900 font-semibold">
                      {formatCurrency(d.amount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {d.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-xs">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Donor insights
          </h3>
          <p className="text-[11px] text-gray-600 mb-2">
            See a quick snapshot of giving from this account.
          </p>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Total donated</dt>
              <dd className="font-semibold text-gray-900">
                {formatCurrency(total)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Number of gifts</dt>
              <dd className="font-semibold text-gray-900">
                {donations.length}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Average gift</dt>
              <dd className="font-semibold text-gray-900">
                {formatCurrency(average || 0)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

function AboutKnowledgeChannelSection() {
  return (
    <section className="py-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">
        About Knowledge Channel Foundation
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-xs text-gray-600 space-y-2">
        <p>
          Knowledge Channel Foundation is a non-profit organization dedicated to
          making quality education accessible to every Filipino learner through
          television, digital platforms, and community-based programs.
        </p>
        <p>
          By partnering with schools, teachers, local governments, and
          development organizations, Knowledge Channel creates and delivers
          curriculum-aligned video lessons and learning resources that support
          students from early childhood to senior high school.
        </p>
        <p>
          Your donations help fund the production of educational content,
          distribute learning kits, train teachers, and expand the reach of
          Knowledge Channel to more homes and classrooms across the country.
        </p>
      </div>
    </section>
  )
}

function HomePage({ onDonate, onViewCampaigns, donations }) {
  const totalFunds = CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0)
  const activeCampaigns = CAMPAIGNS.filter((c) => c.status === 'Active').length

  const stats = {
    totalFunds,
    totalDonors: 124,
    activeCampaigns,
    beneficiaries: 3200,
  }

  return (
    <div className="w-full pb-10">
      <HeroSection onDonate={onDonate} onViewCampaigns={onViewCampaigns} />
      <HomeFeaturedCampaigns onDonate={onDonate} />
      <ImpactStats stats={stats} />
      <WhyDonateSection />
      <TestimonialsSection />
      <DonorHistorySection donations={donations} />
      <AboutKnowledgeChannelSection />
    </div>
  )
}

function CampaignsPage({ onViewDetails, onDonate }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('Most Funded')

  const categories = ['All', ...new Set(CAMPAIGNS.map((c) => c.category))]

  const filtered = CAMPAIGNS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || c.category === category
    const matchesStatus = status === 'All' || c.status === status
    return matchesSearch && matchesCategory && matchesStatus
  }).sort((a, b) => {
    if (sort === 'Most Funded') {
      return b.raised - a.raised
    }
    if (sort === 'Newest') {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    }
    if (sort === 'Ending Soon') {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    }
    return 0
  })

  return (
    <div className="w-full py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500">
            Find a campaign that matches the cause you care about most.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-full text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search campaigns"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] text-gray-500 mb-1">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
          >
            <option>Most Funded</option>
            <option>Newest</option>
            <option>Ending Soon</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((campaign) => {
          const percent = Math.round((campaign.raised / campaign.goal) * 100)
          return (
            <div
              key={campaign.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              <div className="h-28 bg-gray-100 overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {campaign.category}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaign.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {campaign.shortDescription}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>{formatCurrency(campaign.raised)} raised</span>
                    <span>{formatCurrency(campaign.goal)} goal</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-gray-500">
                    <span>{percent}% funded</span>
                    <span>{daysLeft(campaign.endDate)}</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onDonate(campaign.id)}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Donate
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewDetails(campaign.id)}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CampaignDetailsPage({ campaign, recentDonations, onDonate }) {
  if (!campaign) return null
  const percent = Math.round((campaign.raised / campaign.goal) * 100)

  const updates = [
    {
      id: 1,
      date: 'Jan 5, 2025',
      text: 'Distributed first batch of learning kits to 150 students.',
    },
    {
      id: 2,
      date: 'Dec 10, 2024',
      text: 'Campaign reached 50% of its funding goal.',
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div>
        <div className="h-48 md:h-56 rounded-2xl overflow-hidden mb-6 bg-gray-100">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {campaign.title}
        </h1>
        <p className="text-xs text-blue-600 font-medium mb-4">
          {campaign.category}
        </p>
        <p className="text-sm text-gray-600 mb-4">{campaign.fullDescription}</p>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{formatCurrency(campaign.raised)} raised</span>
            <span>{formatCurrency(campaign.goal)} goal</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 mt-1">
            <span>{percent}% funded</span>
            <span>{daysLeft(campaign.endDate)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Recent donations
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 text-sm">
            {recentDonations.length === 0 && (
              <div className="px-4 py-4 text-xs text-gray-500">
                No donations yet. Be the first to give.
              </div>
            )}
            {recentDonations.map((d) => (
              <div key={d.reference} className="px-4 py-3 flex justify-between">
                <div>
                  <p className="text-xs text-gray-700">
                    {d.anonymous ? 'Anonymous donor' : d.name}
                  </p>
                  <p className="text-[11px] text-gray-500">{d.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">
                    {formatCurrency(d.amount)}
                  </p>
                  <p className="text-[11px] text-gray-500">{d.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Updates
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <ul className="space-y-3 text-xs text-gray-600">
              {updates.map((u) => (
                <li key={u.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">{u.date}</p>
                    <p>{u.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <p className="text-xs font-semibold text-gray-900 mb-1">
            Support this campaign
          </p>
          <p className="text-[11px] text-gray-500 mb-3">
            Every contribution brings learners closer to the resources they need.
          </p>
          <button
            type="button"
            onClick={() => onDonate(campaign.id)}
            className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 mb-2"
          >
            Donate Now
          </button>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>Share</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-2 py-1 rounded-full bg-blue-50 text-blue-600"
              >
                Facebook
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-600"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 flex gap-2">
          <BarChart3 className="h-4 w-4 mt-0.5" />
          <p>
            Your donation helps us reach our goal faster and unlock more
            learning opportunities for students.
          </p>
        </div>
      </aside>
    </div>
  )
}

function DonationPage({
  campaigns,
  selectedCampaignId,
  onSubmit,
  onBackToCampaign,
}) {
  const [campaignId, setCampaignId] = useState(selectedCampaignId || '')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('One-time')
  const [method, setMethod] = useState('GCash')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const quickAmounts = [500, 1000, 5000]

  const currentCampaign =
    campaigns.find((c) => c.id === campaignId) ||
    campaigns.find((c) => c.id === selectedCampaignId) ||
    campaigns[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!campaignId || !amount || !name || !email || !termsAccepted) {
      return
    }
    const chosenCampaign = campaigns.find((c) => c.id === campaignId)
    const numericAmount = Number(amount)
    const reference = `KC-${Date.now()}`
    const date = new Date().toLocaleDateString()
    onSubmit({
      campaignId,
      campaignTitle: chosenCampaign ? chosenCampaign.title : '',
      amount: numericAmount,
      type,
      method,
      name,
      email,
      phone,
      anonymous,
      message,
      reference,
      date,
    })
  }

  return (
    <div className="py-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Make a donation</h1>
          {onBackToCampaign && (
            <button
              type="button"
              onClick={onBackToCampaign}
              className="text-xs text-gray-500 hover:text-blue-600"
            >
              Back to campaign
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Choose a campaign, amount, and payment method to complete your
          donation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4 text-xs"
        >
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Select campaign
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
            >
              <option value="">Choose a campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Choose amount
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    Number(amount) === value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
              placeholder="Or enter custom amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Donation type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
              >
                <option>One-time</option>
                <option>Monthly (Recurring)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Payment method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-white"
              >
                <option>GCash</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>PayPal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
              />
            </div>
            <div className="flex items-center mt-5">
              <input
                id="anonymous"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-3 w-3 text-blue-600 border-gray-300 rounded mr-2"
              />
              <label htmlFor="anonymous" className="text-[11px] text-gray-600">
                Give anonymously
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Optional message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-xs"
              rows={3}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-3 w-3 text-blue-600 border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600">
              I agree to the terms and conditions and privacy policy.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Confirm donation
            </button>
          </div>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-xs">
          <p className="text-[11px] text-gray-500 mb-1">
            You are supporting
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {currentCampaign.title}
          </p>
          <p className="text-[11px] text-blue-600 mb-3">
            {currentCampaign.category}
          </p>
          <div className="mb-2">
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>{formatCurrency(currentCampaign.raised)} raised</span>
              <span>{formatCurrency(currentCampaign.goal)} goal</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min(
                    Math.round(
                      (currentCampaign.raised / currentCampaign.goal) * 100,
                    ),
                    100,
                  )}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              {daysLeft(currentCampaign.endDate)}
            </p>
          </div>
          <p className="text-[11px] text-gray-600">
            Your gift helps bring learning tools and content to more students.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900">
          <p className="font-semibold mb-1">Why give monthly?</p>
          <p>
            Monthly support helps sustain long-term programs and reach more
            learners throughout the school year.
          </p>
        </div>
      </aside>
    </div>
  )
}

function ThankYouPage({ donation, onBackHome, onViewCampaign }) {
  if (!donation) return null

  return (
    <div className="py-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
          🎉
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you for your donation
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Your support helps bring learning opportunities to more students
          across the country.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-xs text-left mb-6">
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Campaign</span>
            <span className="font-semibold text-gray-900">
              {donation.campaignTitle}
            </span>
          </p>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(donation.amount)}
            </span>
          </p>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Reference number</span>
            <span className="font-mono text-gray-900">
              {donation.reference}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-900">{donation.date}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-start text-xs">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Download receipt (PDF)
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Share campaign
          </button>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start text-xs">
          <button
            type="button"
            onClick={onViewCampaign}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            View campaign
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Back to home
          </button>
        </div>
      </div>

      <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-xs space-y-3">
        <p className="text-sm font-semibold text-gray-900">
          Your impact continues
        </p>
        <p className="text-gray-600">
          Donations like yours fund learning kits, teacher training, and
          educational content that reach classrooms across the country.
        </p>
        <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-1">
          <li>Receive updates from this campaign as it progresses.</li>
          <li>Share the campaign to inspire other donors.</li>
          <li>Consider a monthly gift to sustain long-term programs.</li>
        </ul>
      </aside>
    </div>
  )
}

function DashboardPage({ donations }) {
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
  const recurring = donations.filter((d) =>
    d.type.startsWith('Monthly'),
  ).length

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500">
            Track your giving history and recurring support.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Total donated</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(totalDonated)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">
            Active recurring donations
          </p>
          <p className="text-lg font-bold text-gray-900">{recurring}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Total donations</p>
          <p className="text-lg font-bold text-gray-900">
            {donations.length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            Donation history
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Campaign
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Type
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Reference
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-500">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No donations yet.
                  </td>
                </tr>
              )}
              {donations.map((d) => (
                <tr key={d.reference}>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {d.date}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {d.campaignTitle}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900 font-semibold">
                    {formatCurrency(d.amount)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {d.type}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700 font-mono">
                    {d.reference}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TransparencyPage() {
  const totalFunds = CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0)
  const completed = CAMPAIGNS.filter((c) => c.status === 'Completed')

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h1>
      <p className="text-sm text-gray-600 mb-6">
        See how funds are allocated and the impact completed campaigns have
        achieved.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">
            Total funds raised (all time)
          </p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(totalFunds)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">
            Completed campaigns
          </p>
          <p className="text-lg font-bold text-gray-900">
            {completed.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-[11px] text-gray-500 mb-1">Impact metrics</p>
          <p className="text-xs text-gray-600">
            Learners reached, schools supported, hours of content aired.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Fund allocation breakdown
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>70% Program implementation</li>
            <li>15% Content development and production</li>
            <li>10% Monitoring and evaluation</li>
            <li>5% Administration</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Annual report
          </p>
          <p className="text-xs text-gray-600 mb-3">
            Download our latest annual report to see detailed financials and
            impact data.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-blue-600 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">
          Completed campaigns
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          {completed.map((c) => (
            <li key={c.id}>
              {c.title} – {formatCurrency(c.raised)} raised
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="py-8 grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact us</h1>
        <p className="text-sm text-gray-600 mb-4">
          Reach out for partnership opportunities, questions about campaigns, or
          support with your donation.
        </p>
        <div className="space-y-2 text-xs text-gray-700">
          <p>
            Email:{' '}
            <span className="font-semibold">donations@knowledgechannel.org</span>
          </p>
          <p>
            Phone:{' '}
            <span className="font-semibold">+63 900 000 0000</span>
          </p>
          <p>
            Office:{' '}
            <span className="font-semibold">
              Ortigas Center, Pasig City, Philippines
            </span>
          </p>
          <p>Facebook · YouTube · Instagram</p>
        </div>
      </div>
      <form className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3 text-xs">
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Subject
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>
        <button
          type="button"
          className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Send message
        </button>
      </form>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">About us</h1>
      <p className="text-sm text-gray-600 mb-4">
        Knowledge Channel Foundation is a non-profit organization that makes
        quality education more accessible to Filipino learners through
        television, digital platforms, and community-based programs.
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Through partnerships with schools, teachers, local governments, and
        development organizations, we design and deliver curriculum-aligned
        video lessons and learning resources that support students from early
        childhood to senior high school.
      </p>
      <p className="text-sm text-gray-600">
        Your donations help fund educational content production, distribute
        learning kits, train teachers, and expand the reach of Knowledge Channel
        to more homes and classrooms across the country.
      </p>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About KCVIP
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          KCVIP (Knowledge Channel Volunteer and Impact Program) brings together
          individuals and organizations who want to actively support the
          mission of improving education for Filipino learners.
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Through KCVIP, volunteers and partners help fund campaigns, share
          learning resources, and participate in community initiatives that make
          Knowledge Channel content more accessible in schools and households.
        </p>
        <p className="text-sm text-gray-600">
          By joining KCVIP or supporting KCVIP campaigns, you become part of a
          community working to ensure that every learner, wherever they are, has
          access to engaging and meaningful learning experiences.
        </p>
      </div>
    </div>
  )
}

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const chosenName = mode === 'signup' && name ? name : email
    if (!chosenName) return
    onLogin(chosenName, remember)
  }

  return (
    <div className="py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? 'Login' : 'Sign up'}
          </h1>
          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
            }
            className="text-xs text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'Create account' : 'Have an account? Login'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
              />
            </div>
          )}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-[11px] text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3 w-3 text-blue-600 border-gray-300 rounded mr-2"
              />
              <label
                htmlFor="remember"
                className="text-[11px] text-gray-600"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-[11px] text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 mt-2"
          >
            {mode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)
  const [donations, setDonations] = useState([])
  const [lastDonation, setLastDonation] = useState(null)

  const selectedCampaign = CAMPAIGNS.find(
    (c) => c.id === selectedCampaignId,
  ) || CAMPAIGNS[0]

  const recentDonationsForSelected = donations.filter(
    (d) => d.campaignId === selectedCampaign.id,
  )

  const handleNavigate = (pageId) => {
    if (pageId === 'logout') {
      setIsLoggedIn(false)
      setUserName('')
      setActivePage('home')
      return
    }
    setActivePage(pageId)
  }

  const handleLogin = (name) => {
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

  const handleDonationSubmit = (donation) => {
    setDonations((prev) => [...prev, donation])
    setLastDonation(donation)
    setSelectedCampaignId(donation.campaignId)
    setActivePage('thank-you')
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      <SideNav
        isLoggedIn={isLoggedIn}
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={isSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <HeaderBar
          userName={userName}
          onToggleSidebar={() =>
            setIsSidebarCollapsed((prevCollapsed) => !prevCollapsed)
          }
        />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          {activePage === 'home' && (
            <HomePage
              onDonate={handleDonateStart}
              onViewCampaigns={() => setActivePage('campaigns')}
              donations={donations}
            />
          )}
          {activePage === 'campaigns' && (
            <CampaignsPage
              onViewDetails={handleViewDetails}
              onDonate={handleDonateStart}
            />
          )}
          {activePage === 'campaign-details' && (
            <CampaignDetailsPage
              campaign={selectedCampaign}
              recentDonations={recentDonationsForSelected}
              onDonate={handleDonateStart}
            />
          )}
          {activePage === 'donate' && (
            <DonationPage
              campaigns={CAMPAIGNS}
              selectedCampaignId={selectedCampaignId}
              onSubmit={handleDonationSubmit}
              onBackToCampaign={() => setActivePage('campaign-details')}
            />
          )}
          {activePage === 'thank-you' && (
            <ThankYouPage
              donation={lastDonation}
              onBackHome={() => setActivePage('home')}
              onViewCampaign={() => setActivePage('campaign-details')}
            />
          )}
          {activePage === 'dashboard' && (
            <DashboardPage donations={donations} />
          )}
          {activePage === 'transparency' && <TransparencyPage />}
          {activePage === 'contact' && <ContactPage />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'login' && <LoginPage onLogin={handleLogin} />}
        </main>
        <footer className="border-t border-gray-200 py-4 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} Knowledge Channel Foundation · For demo
          purposes only
        </footer>
      </div>
    </div>
  )
}
