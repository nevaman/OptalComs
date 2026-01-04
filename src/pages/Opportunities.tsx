import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Trophy, Coins, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CareersTab } from '../components/opportunities/CareersTab';
import { ContestsTab } from '../components/opportunities/ContestsTab';
import { GrantsTab } from '../components/opportunities/GrantsTab';
import { useOpportunities } from '../hooks/useOpportunities';

const tabs = [
  { id: 'careers', label: 'Careers', icon: Briefcase, description: 'Join our team or find your next role' },
  { id: 'contests', label: 'Contests', icon: Trophy, description: 'Creative challenges with prizes' },
  { id: 'grants', label: 'Grants', icon: Coins, description: 'Funding for creative projects' },
] as const;

type TabId = typeof tabs[number]['id'];

export function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabId) || 'careers';
  const { opportunities, isLoading, error } = useOpportunities();

  const setActiveTab = (tab: TabId) => {
    setSearchParams({ tab });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-grid">
        <div className="col-span-full mb-12">
          <SectionHeading
            title="Opportunities"
            subtitle="Discover careers, creative contests, and funding opportunities. We connect talent with possibilities."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-6 text-left border rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'border-orange bg-orange/5 shadow-lg'
                      : 'border-neutral-light hover:border-primary hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isActive ? 'bg-orange text-surface' : 'bg-neutral-light/50 text-primary'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-display font-bold mb-2 ${isActive ? 'text-orange' : ''}`}>
                    {tab.label}
                  </h3>
                  <p className="text-sm text-neutral-mid">{tab.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-full">
          {error && (
            <div className="p-4 mb-4 rounded border border-red-200 bg-red-50 text-red-700">
              Unable to load opportunities right now. {error}
            </div>
          )}
          {activeTab === 'careers' && (
            <CareersTab opportunities={opportunities} isLoading={isLoading} />
          )}
          {activeTab === 'contests' && (
            <ContestsTab opportunities={opportunities} isLoading={isLoading} />
          )}
          {activeTab === 'grants' && (
            <GrantsTab opportunities={opportunities} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
