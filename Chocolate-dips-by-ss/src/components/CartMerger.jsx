import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CartMerger() {
  const { user } = useAuth();
  const { mergeGuestCartWithUser } = useCart();

  useEffect(() => {
    if (user) {
      mergeGuestCartWithUser(user.id);
    }
  }, [user, mergeGuestCartWithUser]);

  return null;
} 