import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GoalDetailRouteProp = RouteProp<RootStackParamList, 'GoalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GoalDetail'>;

export default function GoalDetailScreen() {
  const route = useRoute<GoalDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { goalId } = route.params;

  const goals = useAppStore((state) => state.goals);
  const monthlyRecords = useAppStore((state) => state.monthlyRecords);

  const goal = goals.find((g) => g.id === goalId);
  const goalRecords = monthlyRecords.filter((r) => r.goalId === goalId);

  if (!goal) {
    return (
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <Paragraph>목표를 찾을 수 없습니다.</Paragraph>
            <Button mode="contained" onPress={() => navigation.goBack()}>
              돌아가기
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      not_started: '시작 전',
      in_progress: '진행중',
      completed: '완료',
      paused: '일시중지',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: '#757575',
      in_progress: '#2196F3',
      completed: '#4CAF50',
      paused: '#FF9800',
    };
    return colors[status] || '#757575';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>{goal.title}</Title>
            <Chip
              style={{ backgroundColor: getStatusColor(goal.status) }}
              textStyle={{ color: '#FFFFFF' }}
            >
              {getStatusLabel(goal.status)}
            </Chip>
          </View>

          <Paragraph style={styles.description}>{goal.description}</Paragraph>

          {goal.targetValue && (
            <View style={styles.targetContainer}>
              <Paragraph>목표: {goal.targetValue} {goal.unit}</Paragraph>
              <Paragraph>현재: {goal.currentValue || 0} {goal.unit}</Paragraph>
              <Paragraph>
                진행률: {Math.round(((goal.currentValue || 0) / goal.targetValue) * 100)}%
              </Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>월별 기록</Title>

      {goalRecords.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>아직 기록이 없습니다.</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        goalRecords.map((record) => (
          <Card key={record.id} style={styles.card}>
            <Card.Content>
              <Title>
                {record.year}년 {record.month}월
              </Title>
              <Paragraph>값: {record.value} {goal.unit}</Paragraph>
              {record.note && <Paragraph>메모: {record.note}</Paragraph>}
            </Card.Content>
          </Card>
        ))
      )}

      <Button
        mode="contained"
        onPress={() => console.log('Add monthly record')}
        style={styles.addButton}
      >
        월별 기록 추가
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  targetContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});
