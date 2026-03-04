import React, { createContext, useContext, useMemo, useState } from 'react';

const DataContext = createContext(null);

const initialDonors = [
  {
    id: 1,
    name: 'Mckhale Janry R Natividad',
    email: 'mckhale@example.com',
    type: 'Individual',
    program: 'School Supplies',
    status: 'Active',
  },
  {
    id: 2,
    name: 'John Deniell Soliman',
    email: 'john@example.com',
    type: 'Individual',
    program: 'Teacher Training',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Francis Bartlett Jr',
    email: 'francis@example.com',
    type: 'Corporate',
    program: 'Digital Learning',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Nicole Camua',
    email: 'nicole@example.com',
    type: 'Individual',
    program: 'Learning Kits',
    status: 'Lapsed',
  },
];

const initialCampaigns = [
  {
    id: 1,
    title: 'School Supplies 2024',
    target: 250000,
    endDate: '2024-12-31',
    description:
      'Providing essential school supplies to students in underserved communities across the Philippines.',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Teacher Training Program',
    target: 300000,
    endDate: '2025-03-31',
    description:
      'Supporting training for public school teachers in digital and blended learning.',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Learning Kits for Kids',
    target: 500000,
    endDate: '2025-06-30',
    description:
      'Delivering learning kits and educational content to remote communities.',
    status: 'Planned',
  },
];

const initialDonations = [
  {
    id: 1,
    donor: 'Mckhale Janry R Natividad',
    amount: 1500,
    type: 'One-time',
    campaign: 'School Supplies 2024',
    channel: 'GCash',
    status: 'Completed',
    notes: '',
    date: 'Oct 24, 2024',
  },
  {
    id: 2,
    donor: 'John Deniell Soliman',
    amount: 2500,
    type: 'Recurring',
    campaign: 'Teacher Training Program',
    channel: 'Bank Transfer',
    status: 'Completed',
    notes: '',
    date: 'Oct 23, 2024',
  },
  {
    id: 3,
    donor: 'Francis Bartlett Jr',
    amount: 1000,
    type: 'One-time',
    campaign: 'Learning Kits for Kids',
    channel: 'Credit Card',
    status: 'Pending',
    notes: '',
    date: 'Oct 22, 2024',
  },
];

const formatToday = () =>
  new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const nextId = (items) =>
  items.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

export function DataProvider({ children }) {
  const [donors, setDonors] = useState(initialDonors);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [donations, setDonations] = useState(initialDonations);

  const value = useMemo(() => {
    const getDonorTotal = (name) =>
      donations
        .filter((d) => d.donor === name && typeof d.amount === 'number')
        .reduce((sum, d) => sum + d.amount, 0);

    const getCampaignRaised = (title) =>
      donations
        .filter(
          (d) =>
            d.campaign === title &&
            d.status === 'Completed' &&
            typeof d.amount === 'number',
        )
        .reduce((sum, d) => sum + d.amount, 0);

    const addDonor = (donor) => {
      setDonors((prev) => {
        const id = donor.id ?? nextId(prev);
        return [{ ...donor, id }, ...prev];
      });
    };

    const updateDonor = (updated) => {
      setDonors((prev) =>
        prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)),
      );
    };

    const deleteDonor = (id) => {
      setDonors((prev) => prev.filter((d) => d.id !== id));
    };

    const addCampaign = (campaign) => {
      setCampaigns((prev) => {
        const id = campaign.id ?? nextId(prev);
        return [{ ...campaign, id }, ...prev];
      });
    };

    const updateCampaign = (updated) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
      );
    };

    const deleteCampaign = (id) => {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    };

    const addDonation = (donation) => {
      setDonations((prev) => {
        const id = donation.id ?? nextId(prev);
        const amount = Number(donation.amount ?? 0);
        const date = donation.date || formatToday();
        return [{ ...donation, id, amount, date }, ...prev];
      });
    };

    const updateDonation = (updated) => {
      setDonations((prev) =>
        prev.map((d) => {
          if (d.id !== updated.id) return d;
          const amount =
            updated.amount !== undefined ? Number(updated.amount) : d.amount;
          const date = updated.date || d.date;
          return { ...d, ...updated, amount, date };
        }),
      );
    };

    const deleteDonation = (id) => {
      setDonations((prev) => prev.filter((d) => d.id !== id));
    };

    return {
      donors,
      campaigns,
      donations,
      getDonorTotal,
      getCampaignRaised,
      addDonor,
      updateDonor,
      deleteDonor,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addDonation,
      updateDonation,
      deleteDonation,
    };
  }, [donors, campaigns, donations]);

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

