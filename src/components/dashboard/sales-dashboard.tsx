'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header/header';
import { Button } from '@/components/ui/button';
import { getSalesData, getRecentSales, type SaleData, type RecentSale } from '@/actions/sales';
import { getUserBalance } from '@/actions/withdrawals';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { SalesStats } from '@/components/dashboard/sales-stats';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Calendar, 
  RefreshCw, 
  ArrowUpRight,
  Wallet,
  Palette
} from 'lucide-react';
import { dateKeyMaker } from '@/lib/utils';
import { LoaderSkeleton } from '@/components/dashboard/loader-skeletone';
import { Link, useRouter } from '@tanstack/react-router';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useUserProfile } from '~/hooks/use-user';
import { useInvalidateUserData } from '~/hooks/use-user-query';

export default function SalesDashboard() {
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('day');
  const [salesLimit, setSalesLimit] = useState('10');

  const {userProfile, isLoading: isLoadingUserProfile, refetch: refetchUserProfile} = useUserProfile();

  const {data: salesData = [], isLoading: isLoadingSales, refetch: refetchSales, isFetching: isFetchingSales} = useQuery({
    queryKey: ['salesData', timeframe],
    queryFn: () => getSalesData({data: {timeframe}}),
  });
  const {data: recentSales, isLoading: isLoadingRecentSales, refetch: refetchRecentSales, isFetching: isFetchingRecentSales} = useQuery({
    queryKey: ['recentSales', salesLimit],
    queryFn: () => getRecentSales({data:{limit: parseInt(salesLimit)} }),
  });
  // const {data: balance, isLoading: isLoadingUserBalance, refetch: refetchBalance} = useQuery({
  //   queryKey: ['userBalance'],
  //   queryFn: () => getUserBalance({data: {userId: undefined}})
  // });

  if (isLoadingSales || isLoadingUserProfile) {
    return (<main className="container mx-auto px-4 py-8">
      <LoaderSkeleton />
    </main>);
  }

  // Calculate summary statistics for current timeframe (day, month, year)
  const currentDate = new Date();
  const currentDateKey = dateKeyMaker(timeframe, currentDate);
  const totalSales = salesData.find(sale => sale.date === currentDateKey)?.amount || 0;
  const totalTransactions = salesData.find(sale => sale.date === currentDateKey)?.transactions || 0;
  const avgOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  const totalUniqueCustomers = salesData.find(sale => sale.date === currentDateKey)?.uniqueCustomers?.length || 0;
  
  // Calculate growth percentages by comparing with previous period
  const getPreviousPeriodKey = (currentKey: string, timeframe: 'day' | 'month' | 'year') => {
    const [year, month, day] = currentKey.split('-').map(Number);
    switch (timeframe) {
      case 'day':
        const prevDate = new Date(year, month - 1, day - 1);
        return dateKeyMaker('day', prevDate);
      case 'month':
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
      case 'year':
        return `${year - 1}`;
    }
  };

  const previousDateKey = getPreviousPeriodKey(currentDateKey, timeframe);
  const previousSales = salesData.find(sale => sale.date === previousDateKey)?.amount || 0;
  const previousTransactions = salesData.find(sale => sale.date === previousDateKey)?.transactions || 0;
  const previousAOV = previousTransactions > 0 ? previousSales / previousTransactions : 0;
  const previousUniqueCustomers = salesData.find(sale => sale.date === previousDateKey)?.uniqueCustomers?.length || 0;

  // Calculate growth percentages
  const salesGrowth = previousSales > 0 ? ((totalSales - previousSales) / previousSales) * 100 : 0;
  const transactionsGrowth = previousTransactions > 0 ? ((totalTransactions - previousTransactions) / previousTransactions) * 100 : 0;
  const aovGrowth = previousAOV > 0 ? ((avgOrderValue - previousAOV) / previousAOV) * 100 : 0;
  const uniqueCustomersGrowth = previousUniqueCustomers > 0 ? ((totalUniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 : 0;

  const handleLimitChange = (newLimit: string) => {
    setSalesLimit(newLimit);
  };

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="max-sm:hidden text-md md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-xl font-bold">₹{userProfile?.balance!.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
              <Link to="/dashboard/myprofile/withdrawals">
              <Button
                className="bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Withdraw Funds
              </Button></Link>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/dashboard/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/shop-customization">
                    <Palette className="h-4 w-4 mr-2" />
                    Customize Shop
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Time Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={timeframe === 'day' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('day')}
              className={timeframe === 'day' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Daily
            </Button>
            <Button
              variant={timeframe === 'month' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('month')}
              className={timeframe === 'month' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Monthly
            </Button>
            <Button
              variant={timeframe === 'year' ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe('year')}
              className={timeframe === 'year' ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Yearly
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // invalidateProfileQuery()
                refetchUserProfile();
                refetchSales();
                refetchRecentSales();
                // refetchBalance();
              }}
              className="ml-auto"
              disabled={isFetchingSales || isFetchingRecentSales}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {isFetchingSales || isFetchingRecentSales ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Sales Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sales this {timeframe}</p>
                  <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{salesGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Orders Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders this {timeframe}</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{transactionsGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Average Order Value Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Order Value this {timeframe}</p>
                  <p className="text-2xl font-bold">₹{avgOrderValue.toFixed(2)}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{aovGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Customers Card */}
            <Card className="p-4 border-none bg-gradient-to-br from-green-50 to-teal-50 shadow-sm transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Customers</p>
                  <p className="text-2xl font-bold">{totalUniqueCustomers}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{uniqueCustomersGrowth}% from last period</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts and Recent Sales Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[850px]">
          {/* Charts Section - Takes half of the space on larger screens */}
          <div className="space-y-6 h-full flex flex-col">
            <SalesChart data={salesData} />
            <SalesStats data={salesData} />
          </div>
          
          {/* Recent Sales Section - Takes half of the space on larger screens */}
          <div className="h-full">
            <RecentSales 
              sales={recentSales ?? []} 
              onLimitChange={handleLimitChange}
              currentLimit={salesLimit}
            />
          </div>
        </div>
      </main>
  );
}