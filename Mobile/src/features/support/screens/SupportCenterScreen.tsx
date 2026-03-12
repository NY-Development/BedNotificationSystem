import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { supportApi } from '@/src/features/support/api/supportApi';
import { Header } from '@/src/components/layout/Header';
import { Send, TicketCheck, Bot, User, Phone } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface ChatBubble {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
}

const QUICK_TOPICS = ['Reset Sensors', 'Patient Transfer', 'Sync Error'];

const INITIAL_MESSAGES: ChatBubble[] = [
  {
    id: '1',
    text: "Hello! I'm your BNS assistant. How can I help you manage your ward today?",
    isUser: false,
    time: '',
  },
];

export default function SupportCenterScreen() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatBubble[]>(INITIAL_MESSAGES);

  const createTicket = useMutation({
    mutationFn: (payload: { subject: string; message: string }) => supportApi.createTicket(payload),
    onSuccess: () => {
      Alert.alert('Ticket Sent', 'Your support ticket has been submitted.');
      setSubject('');
      setDescription('');
    },
  });

  const handleSubmitTicket = () => {
    if (!subject.trim() || !description.trim()) return;
    createTicket.mutate({ subject: subject.trim(), message: description.trim() });
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatBubble = {
      id: `u-${Date.now()}`,
      text: chatInput.trim(),
      isUser: true,
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulated bot response
    setTimeout(() => {
      const botMsg: ChatBubble = {
        id: `b-${Date.now()}`,
        text: 'Thank you for your message. A support agent will review and respond shortly.',
        isUser: false,
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleQuickTopic = (topic: string) => {
    setChatInput(topic);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Support Center" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="pb-4">
          {/* Ticket Submission */}
          <View className="p-4">
            <View className="rounded-xl border border-border bg-card p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={TicketCheck} className="text-primary" size={22} />
                <Text className="text-base font-bold text-foreground">Submit a Ticket</Text>
              </View>

              <View className="gap-4">
                <View className="gap-1.5">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subject
                  </Text>
                  <TextInput
                    className="h-11 rounded-lg border border-border bg-muted px-3 text-sm text-foreground"
                    placeholder="e.g. Bed Sensor Error in Room 302"
                    placeholderTextColor="#94A3B8"
                    value={subject}
                    onChangeText={setSubject}
                  />
                </View>
                <View className="gap-1.5">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description
                  </Text>
                  <TextInput
                    className="min-h-[100px] rounded-lg border border-border bg-muted px-3 py-3 text-sm text-foreground"
                    placeholder="Describe the issue in detail..."
                    placeholderTextColor="#94A3B8"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <Pressable
                  onPress={handleSubmitTicket}
                  className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary active:opacity-90">
                  <Text className="font-medium text-white">
                    {createTicket.isPending ? 'Sending...' : 'Send Ticket'}
                  </Text>
                  <Icon as={Send} className="text-white" size={16} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center gap-4 px-6 py-2">
            <View className="h-px flex-1 bg-border" />
            <Text className="text-xs font-medium uppercase text-muted-foreground">
              Or Try Quick Help
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Chat Section */}
          <View className="gap-4 px-4 pt-2">
            {messages.map((msg) =>
              msg.isUser ? (
                <View key={msg.id} className="flex-row-reverse gap-3">
                  <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon as={User} className="text-muted-foreground" size={16} />
                  </View>
                  <View className="max-w-[85%] items-end gap-1">
                    <View className="rounded-l-xl rounded-br-xl bg-primary p-3">
                      <Text className="text-sm leading-snug text-white">{msg.text}</Text>
                    </View>
                    {msg.time ? (
                      <Text className="mr-1 text-[10px] text-muted-foreground">{msg.time}</Text>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View key={msg.id} className="flex-row gap-3">
                  <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={Bot} className="text-primary" size={16} />
                  </View>
                  <View className="max-w-[85%] gap-1">
                    <View className="rounded-r-xl rounded-bl-xl border border-border bg-card p-3">
                      <Text className="text-sm leading-snug text-foreground">{msg.text}</Text>
                    </View>
                    {msg.time ? (
                      <Text className="ml-1 text-[10px] text-muted-foreground">{msg.time}</Text>
                    ) : null}
                  </View>
                </View>
              )
            )}

            {/* Quick Topics */}
            {messages.length <= 2 && (
              <View className="ml-11 flex-row flex-wrap gap-3">
                {QUICK_TOPICS.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => handleQuickTopic(t)}
                    className="rounded-full bg-muted px-3 py-1.5 active:bg-border">
                    <Text className="text-xs text-foreground">{t}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Emergency Hotline */}
          <View className="mt-6 items-center">
            <View className="flex-row items-center gap-2 rounded-full bg-red-50 px-4 py-2">
              <Icon as={Phone} className="text-red-500" size={14} />
              <Text className="text-xs font-bold uppercase tracking-wide text-red-500">
                Emergency Hotline: 555-0199
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Chat Input */}
        <View className="border-t border-border bg-background px-4 pb-4 pt-2">
          <View className="flex-row items-center gap-2">
            <TextInput
              className="h-12 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground"
              placeholder="Type a quick question..."
              placeholderTextColor="#94A3B8"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendChat}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSendChat}
              className="h-10 w-10 items-center justify-center rounded-full bg-muted active:bg-border">
              <Icon as={Send} className="text-primary" size={18} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
