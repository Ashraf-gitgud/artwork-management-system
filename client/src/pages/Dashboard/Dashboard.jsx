import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Image,
  Archive,
  Tag,
  Gavel,
  Layout,
  RotateCcw,
  Package,
  AlertTriangle,
} from 'lucide-react';

import { useGetArtworksQuery } from '../../features/artworks/artworkApi';
import { useGetArtistsQuery } from '../../features/artists/artistApi';
import { useGetCategoriesQuery } from '../../features/categories/categoryApi';
import { useGetBuyersQuery } from '../../features/buyer/buyerApi';
import { useGetDepositorsQuery } from '../../features/depositors/depositorApi';

import Spinner from '../../components/ui/Spinner';
import { isBinStatus } from '../../features/artworks/artworkUtils';

function StatCard({ label, value, icon: Icon, tone = 'navy', to }) {
  const tones = {
    navy: 'bg-navy-700 text-white hover:bg-navy-800',
    slate:
      'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100',
    emerald:
      'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100',
    amber:
      'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100',
    sky:
      'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100',
    violet:
      'bg-violet-50 text-violet-800 border border-violet-200 hover:bg-violet-100',
    neutral:
      'bg-zinc-50 text-zinc-800 border border-zinc-200 hover:bg-zinc-100',
    red:
      'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100',
  };

  const content = (
    <div
      className={`
        rounded-xl p-5
        flex items-start justify-between gap-4
        transition-colors
        ${tones[tone]}
      `}
    >
      <div>
        <p className="text-sm font-medium opacity-75">{label}</p>
        <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
      </div>

      <div className="opacity-70">
        <Icon size={27} strokeWidth={1.8} />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);

  const {
    data: artworks = [],
    isLoading: loadingArt,
  } = useGetArtworksQuery();

  const {
    data: artists = [],
    isLoading: loadingArtists,
  } = useGetArtistsQuery();

  const {
    data: categories = [],
    isLoading: loadingCats,
  } = useGetCategoriesQuery();

  const {
    data: buyers = [],
    isLoading: loadingBuyers,
  } = useGetBuyersQuery();

  const {
    data: depositors = [],
    isLoading: loadingDeps,
  } = useGetDepositorsQuery();

  const stats = useMemo(() => {
    const total = artworks.length;

    const active = artworks.filter(
      (artwork) => !isBinStatus(artwork.status)
    );

    const inGallery = active.length;

    const forSale = artworks.filter(
      (artwork) => artwork.status === 'for_sale'
    ).length;

    const forAuction = artworks.filter(
      (artwork) => artwork.status === 'for_auction'
    ).length;

    const forExhibit = artworks.filter(
      (artwork) => artwork.status === 'for_exhibit'
    ).length;

    const returned = artworks.filter(
      (artwork) => artwork.status === 'returned'
    ).length;

    const sold = artworks.filter(
      (artwork) => artwork.status === 'sold'
    ).length;

    const missing = artworks.filter(
      (artwork) => artwork.status === 'missing'
    ).length;

    const inStorage = artworks.filter(
      (artwork) => artwork.status === 'in_storage'
    ).length;

    return {
      total,
      inGallery,
      forSale,
      forAuction,
      forExhibit,
      returned,
      sold,
      missing,
      inStorage,
    };
  }, [artworks]);

  const loading =
    loadingArt ||
    loadingArtists ||
    loadingCats ||
    loadingBuyers ||
    loadingDeps;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900">
          Welcome back, {user?.firstName || 'User'}
        </h2>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Collection"
          value={stats.total}
          icon={Image}
          tone="navy"
          to="/artworks"
        />

        <StatCard
          label="Active Inventory"
          value={stats.inGallery}
          icon={Package}
          tone="slate"
          to="/artworks"
        />

        <StatCard
          label="Available for Sale"
          value={stats.forSale}
          icon={Tag}
          tone="emerald"
          to="/artworks"
        />

        <StatCard
          label="Listed for Auction"
          value={stats.forAuction}
          icon={Gavel}
          tone="amber"
          to="/artworks"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="On Exhibit"
          value={stats.forExhibit}
          icon={Layout}
          tone="sky"
          to="/artworks"
        />

        <StatCard
          label="Returned"
          value={stats.returned}
          icon={RotateCcw}
          tone="violet"
          to="/artworks"
        />

        <StatCard
          label="Sold"
          value={stats.sold}
          icon={Archive}
          tone="neutral"
          to="/artworks"
        />

        <StatCard
          label="Missing"
          value={stats.missing}
          icon={AlertTriangle}
          tone="red"
          to="/artworks"
        />
      </div>

      {/* Entity overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-navy-200 rounded-xl p-5">
          <p className="text-sm font-medium text-navy-500">
            Artists
          </p>

          <p className="text-2xl font-bold text-navy-900 mt-1">
            {artists.length}
          </p>

          <Link
            to="/artists"
            className="text-sm text-navy-600 hover:text-navy-900 mt-2 inline-block"
          >
            Manage artists →
          </Link>
        </div>

        <div className="bg-white border border-navy-200 rounded-xl p-5">
          <p className="text-sm font-medium text-navy-500">
            Buyers
          </p>

          <p className="text-2xl font-bold text-navy-900 mt-1">
            {buyers.length}
          </p>

          <Link
            to="/buyers"
            className="text-sm text-navy-600 hover:text-navy-900 mt-2 inline-block"
          >
            Manage buyers →
          </Link>
        </div>

        <div className="bg-white border border-navy-200 rounded-xl p-5">
          <p className="text-sm font-medium text-navy-500">
            Categories
          </p>

          <p className="text-2xl font-bold text-navy-900 mt-1">
            {categories.length}
          </p>

          <Link
            to="/categories"
            className="text-sm text-navy-600 hover:text-navy-900 mt-2 inline-block"
          >
            Manage categories →
          </Link>
        </div>
      </div>

      {/* Inventory breakdown */}
      <div className="bg-white border border-navy-200 rounded-xl p-5">
        <p className="text-sm font-medium text-navy-500 mb-4">
          Inventory breakdown
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
            In storage: {stats.inStorage}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800">
            For sale: {stats.forSale}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800">
            For auction: {stats.forAuction}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-800">
            On exhibit: {stats.forExhibit}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-800">
            Returned: {stats.returned}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700">
            Sold: {stats.sold}
          </span>

          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-800">
            Missing: {stats.missing}
          </span>
        </div>
      </div>
    </div>
  );
}