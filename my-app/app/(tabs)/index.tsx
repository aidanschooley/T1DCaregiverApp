import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerHeight={0}>
      <ThemedView style={styles.backContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">{
                    <IconSymbol
                      size={50}
                      color="#808080"
                      name="chevron.left"
                    />
                  }
            </ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>
      </ThemedView>

      <ThemedView>
        <View style={styles.bgCircle}>
          <ThemedText style={{ fontSize: 32 }}>
            100
          </ThemedText>
        </View>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.chart}>
          Chart
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.suggestion}>
          Current Suggestion
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.text}>
          Current Encouragement
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    gap: 8,
    marginBottom: 8,
    paddingTop: 16,
  },
  bgCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 100,
    width: 150,
    height: 150,
  }, 
  chart: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  }, 
  suggestion: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  },
  text: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  }
});
