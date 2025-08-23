import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCartAndSaveThunk, 
  removeFromCartAndSaveThunk,
  updateQuantityAndSaveThunk,
  clearCartAndStorageThunk,
  loadCartFromStorageThunk,
  addTrackToCartAndSaveThunk
} from '../store/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, isLoading, error } = useSelector(state => state.cart);
  // const initItem = (item) => {
  //   if (item.type === 'track') {
  //     item.id = item.track_id + item.license_type_id;
  //   }
  //   dispatch(addToCartAndSaveThunk(item));
  // };
  
  // Action handlers using thunks for proper persistence
  const handleAddToCart = (item) => dispatch(addToCartAndSaveThunk(item));
  const handleAddTrackToCart = (currentTrack, licenseOption) =>  dispatch(addTrackToCartAndSaveThunk({track: currentTrack, licenseOption}));
  const handleRemoveFromCart = (itemId) => dispatch(removeFromCartAndSaveThunk(itemId));
  const handleUpdateQuantity = (itemId, quantity) => 
    dispatch(updateQuantityAndSaveThunk({ itemId, quantity }));
  const handleClearCart = () => dispatch(clearCartAndStorageThunk());
  
  // Helper functions (these don't need to change)
  const isInCart = (itemId) => items.some(item => item.id === itemId); //for items other than tracks
  const isTrackLicenseInCart = (trackId, licenseId) => 
    items.some(item => item.id === trackId && item.licenseId === licenseId); //for tracks
  const getItemById = (itemId) => items.find(item => item.id === itemId) || null;
  const getItemsByTrackId = (trackId) => items.filter(item => item.trackId === trackId);
  
  return {
    // State
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    
    // Actions with persistence
    addToCart: handleAddToCart,
    addTrackToCart: handleAddTrackToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    
    // Helpers
    isInCart,
    isTrackLicenseInCart,
    getItemById,
    getItemsByTrackId,
  };
};

export default useCart;