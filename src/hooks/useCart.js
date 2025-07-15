import { useCartContext } from '../context/cart/CartContext';

/**
 * Custom hook that provides simplified access to cart functionality
 * This adds convenience methods on top of the base CartContext
 */
const useCart = () => {
  const cart = useCartContext();
  
  /**
   * Format a price as currency
   * @param {number} price - Price to format
   * @returns {string} Formatted price
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  /**
   * Formatted total price for display
   */
  const formattedTotalPrice = formatPrice(cart.totalPrice);
  
  /**
   * Increment item quantity
   * @param {string} itemId - ID of the item
   */
  const incrementQuantity = (itemId) => {
    const item = cart.getItemById(itemId);
    if (item) {
      cart.updateQuantity(itemId, item.quantity + 1);
    }
  };
  
  /**
   * Decrement item quantity
   * If quantity would go below 1, remove the item
   * @param {string} itemId - ID of the item
   */
  const decrementQuantity = (itemId) => {
    const item = cart.getItemById(itemId);
    if (item) {
      if (item.quantity > 1) {
        cart.updateQuantity(itemId, item.quantity - 1);
      } else {
        cart.removeFromCart(itemId);
      }
    }
  };
  
  /**
   * Add track with specific license to cart
   * @param {Object} track - Track object
   * @param {Object} licenseOption - Selected license option with price
   */
  const addTrackToCart = (track, licenseOption) => {
    cart.addToCart({ //this comes from the cart context
      id: track.id,
      name: track.title,
      description: `${track.title} by ${track.artist} - ${licenseOption.name} License`,
      image: track.image,
      price: licenseOption.price,
      license: licenseOption.id,
      quantity: 1,
      type: 'track'
    });
  };
  
  /**
   * Check if a specific track with license is in cart
   * @param {string} trackId - Track ID
   * @param {string} licenseId - License ID
   * @returns {boolean} Whether item is in cart
   */
  const isTrackInCart = (trackId, licenseId) => {
    return cart.isInCart(trackId, licenseId);
  };
  
  /**
   * Get all licenses of a track that are in cart
   * @param {string} trackId - Track ID
   * @returns {Array} Array of cart items for this track
   */
  const getTrackLicensesInCart = (trackId) => {
    return cart.getItemsByTrackId(trackId);
  };
  
  return {
    ...cart,
    formatPrice,
    formattedTotalPrice,
    incrementQuantity,
    decrementQuantity,
    addTrackToCart,
    isTrackInCart,
    getTrackLicensesInCart
  };
};

export default useCart;
