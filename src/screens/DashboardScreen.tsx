import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, ProgressBar } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedYearId = useAppStore((state) => state.selectedYearId);
  const years = useAppStore((state) => state.years);
  const goals = useAppStore((state) => state.goals);

  const selectedYear = years.find((y) => y.id === selectedYearId);
  const yearGoals = goals.filter((g) => g.yearId === selectedYearId);

  const handleGoalPress = (goalId: string) => {
    navigation.navigate('GoalDetail', { goalId });
  };

  const handleAddGoal = () => {
    // TODO: 목표 추가 모달 또는 화면으로 이동
    console.log('Add goal');
  };

  const handleMonthlyReview = () => {
    if (selectedYearId && selectedYear) {
      const now = new Date();
      navigation.navigate('MonthlyReview', {
        yearId: selectedYearId,
        year: selectedYear.year,
        month: now.getMonth() + 1,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>
          {selectedYear ? `${selectedYear.year}년 목표` : '대시보드'}
        </Title>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Paragraph>전체 목표: {yearGoals.length}개</Paragraph>
            <Paragraph>
              진행중: {yearGoals.filter((g) => g.status === 'in_progress').length}개
            </Paragraph>
            <Paragraph>
              완료: {yearGoals.filter((g) => g.status === 'completed').length}개
            </Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleMonthlyReview}
          style={styles.reviewButton}
        >
          이번 달 회고 작성
        </Button>

        <Title style={styles.sectionTitle}>목표 목록</Title>

        {yearGoals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph>등록된 목표가 없습니다.</Paragraph>
            </Card.Content>
          </Card>
        ) : (
          yearGoals.map((goal) => (
            <Card
              key={goal.id}
              style={styles.goalCard}
              onPress={() => handleGoalPress(goal.id)}
            >
              <Card.Content>
                <Title>{goal.title}</Title>
                <Paragraph>{goal.description}</Paragraph>
                {goal.targetValue && (
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={(goal.currentValue || 0) / goal.targetValue}
                      style={styles.progressBar}
                    />
                    <Paragraph>
                      {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                    </Paragraph>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddGoal}
        label="목표 추가"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    fontSize: 24,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
  },
  reviewButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 20,
  },
  emptyCard: {
    margin: 16,
  },
  goalCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
