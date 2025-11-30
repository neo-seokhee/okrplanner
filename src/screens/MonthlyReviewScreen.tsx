import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, TextInput, Button } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MonthlyReviewRouteProp = RouteProp<RootStackParamList, 'MonthlyReview'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MonthlyReview'>;

export default function MonthlyReviewScreen() {
  const route = useRoute<MonthlyReviewRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { yearId, year, month } = route.params;

  const monthlyReviews = useAppStore((state) => state.monthlyReviews);
  const addMonthlyReview = useAppStore((state) => state.addMonthlyReview);
  const updateMonthlyReview = useAppStore((state) => state.updateMonthlyReview);

  const existingReview = monthlyReviews.find(
    (r) => r.yearId === yearId && r.year === year && r.month === month
  );

  const [content, setContent] = useState(existingReview?.content || '');
  const [highlights, setHighlights] = useState(
    existingReview?.highlights?.join('\n') || ''
  );
  const [improvements, setImprovements] = useState(
    existingReview?.improvements?.join('\n') || ''
  );

  const handleSave = () => {
    const reviewData = {
      yearId,
      year,
      month,
      content,
      highlights: highlights ? highlights.split('\n').filter((h) => h.trim()) : [],
      improvements: improvements
        ? improvements.split('\n').filter((i) => i.trim())
        : [],
    };

    if (existingReview) {
      updateMonthlyReview(existingReview.id, reviewData);
    } else {
      addMonthlyReview(reviewData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>
        {year}년 {month}월 회고
      </Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>회고 내용</Paragraph>
          <TextInput
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={6}
            placeholder="이번 달은 어땠나요?"
            style={styles.textArea}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>잘한 점 (한 줄씩 입력)</Paragraph>
          <TextInput
            value={highlights}
            onChangeText={setHighlights}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="예:\n- 운동을 꾸준히 했다\n- 새로운 기술을 배웠다"
            style={styles.textArea}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>개선할 점 (한 줄씩 입력)</Paragraph>
          <TextInput
            value={improvements}
            onChangeText={setImprovements}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="예:\n- 시간 관리를 더 잘하기\n- 독서 시간 늘리기"
            style={styles.textArea}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        disabled={!content.trim()}
      >
        저장
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textArea: {
    minHeight: 100,
  },
  saveButton: {
    marginBottom: 24,
  },
});
