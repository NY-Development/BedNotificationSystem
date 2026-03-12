import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { supportApi } from '@/src/features/support/api/supportApi';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import type { SupportTicket } from '@/src/types';

type TabFilter = 'all' | 'open' | 'closed';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SupportInboxScreen() {
  const [tab, setTab] = useState<TabFilter>('open');

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['supportTickets'],
    queryFn: async () => {
      const { data } = await supportApi.getAllTickets();
      return data as SupportTicket[];
    },
  });

  const filtered = useMemo(() => {
    if (!tickets) return [];
    if (tab === 'all') return tickets;
    return tickets.filter((t) => (tab === 'open' ? t.status === 'open' : t.status === 'closed'));
  }, [tickets, tab]);

  const openCount = tickets?.filter((t) => t.status === 'open').length ?? 0;

  const tabs: { label: string; value: TabFilter; count?: number }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open', count: openCount },
    { label: 'Resolved', value: 'closed' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Support Messages" showBack />

      {/* Status Tabs */}
      <View className="mt-2 border-b border-border px-4">
        <View className="flex-row gap-6">
          {tabs.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => setTab(t.value)}
              className={`border-b-2 pb-3 pt-2 ${
                tab === t.value ? 'border-primary' : 'border-transparent'
              }`}>
              <View className="flex-row items-center gap-1.5">
                <Text
                  className={`text-sm font-semibold ${
                    tab === t.value ? 'font-bold text-primary' : 'text-muted-foreground'
                  }`}>
                  {t.label}
                </Text>
                {t.count !== undefined && t.count > 0 && (
                  <View className="rounded-full bg-primary px-1.5 py-0.5">
                    <Text className="text-[10px] font-bold text-white">{t.count}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No tickets" message="No support tickets match this filter." />
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="pb-24">
          {filtered.map((ticket) => {
            const isUrgent =
              ticket.subject?.toLowerCase().includes('urgent') ||
              ticket.message?.toLowerCase().includes('urgent');
            return (
              <View
                key={ticket._id}
                className={`flex-row gap-4 border-b border-border px-4 py-5 ${
                  isUrgent ? 'border-l-4 border-l-red-500 bg-primary/5' : 'bg-card'
                }`}>
                <View className="h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  <Text className="text-lg font-bold text-primary">
                    {(ticket.userName ?? ticket.userId ?? '?').charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View className="flex-1">
                  <View className="mb-1 flex-row items-start justify-between">
                    <Text className="flex-1 text-base font-bold text-foreground" numberOfLines={1}>
                      {ticket.userName ?? 'User'}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {timeAgo(ticket.createdAt)}
                    </Text>
                  </View>
                  <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {ticket.status === 'open' ? 'Open' : 'Resolved'}
                    {isUrgent && <Text className="text-red-600"> • Urgent</Text>}
                  </Text>
                  <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                    {ticket.subject}: {ticket.message}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
