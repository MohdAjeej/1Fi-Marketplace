import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '../contexts/CartContext';
import { OrdersProvider } from '../contexts/OrdersContext';

export default function RootLayout() {
  return (
    <OrdersProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E40AF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="marketplace/index" 
            options={{ 
              title: '1Fi Marketplace',
              presentation: 'card'
            }} 
          />
          <Stack.Screen 
            name="marketplace/product/[id]" 
            options={{ 
              title: 'Product Details',
              presentation: 'card'
            }} 
          />
          <Stack.Screen 
            name="brands/index" 
            options={{ 
              title: 'Top Brands',
              presentation: 'card',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="stores/index" 
            options={{ 
              title: 'Nearby Stores',
              presentation: 'card',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="checkout/index" 
            options={{ 
              title: 'Checkout',
              presentation: 'modal',
              headerShown: false
            }} 
          />
        </Stack>
      </CartProvider>
    </OrdersProvider>
  );
}
