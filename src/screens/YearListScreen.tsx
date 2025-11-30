import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function YearListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const years = useAppStore((state) => state.years);
  const setSelectedYear = useAppStore((state) => state.setSelectedYear);
  const addYear = useAppStore((state) => state.addYear);

  const handleSelectYear = (yearId: string) => {
    setSelectedYear(yearId);
    navigation.navigate('MainApp');
  };

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear();
    addYear({
      year: currentYear,
      title: `${currentYear}년 목표`,
      isActive: true,
    });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>연도 선택</Title>

      {years.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph>등록된 연도가 없습니다.</Paragraph>
            <Button mode="contained" onPress={handleAddYear} style={styles.addButton}>
              첫 연도 추가하기
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={years}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.yearCard} onPress={() => handleSelectYear(item.id)}>
              <Card.Content>
                <Title>{item.year}년</Title>
                <Paragraph>{item.title}</Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddYear}
        label="연도 추가"
      />
    </View>
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
  emptyCard: {
    marginTop: 32,
  },
  addButton: {
    marginTop: 16,
  },
  yearCard: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
