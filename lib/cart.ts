export type CartItem = {
  product_id: number;
  product_name: string;
  product_name_urdu: string | null;
  slug: string;
  image: string;
  variant_id: number;
  quantity_value: number;
  unit: string;
  price: number;
  quantity: number;
};

const CART_KEY = "isaco-cart";
const CART_UPDATED_EVENT = "cart-updated";

/**
 * =====================================================
 * NORMALIZE CART
 * =====================================================
 *
 * Ensures:
 *
 * 1. Product IDs are numbers.
 * 2. Variant IDs are numbers.
 * 3. Quantity is always at least 1.
 * 4. Price and quantity_value are valid numbers.
 * 5. One product + one variant = one cart line.
 * 6. Old duplicate localStorage entries are merged.
 */
function normalizeCart(items: unknown[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const rawItem of items) {
    if (
      !rawItem ||
      typeof rawItem !== "object"
    ) {
      continue;
    }

    const item = rawItem as Partial<CartItem>;

    const productId = Number(
      item.product_id
    );

    const variantId = Number(
      item.variant_id
    );

    if (
      !Number.isFinite(productId) ||
      !Number.isFinite(variantId)
    ) {
      continue;
    }

    const quantityValue = Number(
      item.quantity_value
    );

    const price = Number(item.price);

    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    );

    const normalizedItem: CartItem = {
      product_id: productId,

      product_name: String(
        item.product_name ?? ""
      ),

      product_name_urdu:
        item.product_name_urdu
          ? String(item.product_name_urdu)
          : null,

      slug: String(
        item.slug ?? ""
      ),

      image: String(
        item.image ?? ""
      ),

      variant_id: variantId,

      quantity_value:
        Number.isFinite(quantityValue)
          ? quantityValue
          : 0,

      unit: String(
        item.unit ?? ""
      ),

      price:
        Number.isFinite(price)
          ? price
          : 0,

      quantity,
    };

    /*
     * Product + Variant is the unique cart identity.
     */
    const key = `${productId}-${variantId}`;

    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity:
          existing.quantity +
          normalizedItem.quantity,
      });
    } else {
      merged.set(
        key,
        normalizedItem
      );
    }
  }

  return Array.from(
    merged.values()
  );
}

/**
 * =====================================================
 * GET CART
 * =====================================================
 *
 * Reads cart from localStorage.
 *
 * Also repairs old cart data containing duplicate
 * product + variant combinations.
 */
export function getCart(): CartItem[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const saved =
      localStorage.getItem(
        CART_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalizedCart =
      normalizeCart(parsed);

    /*
     * Repair localStorage if the existing
     * data was not normalized.
     */
    const originalJson =
      JSON.stringify(parsed);

    const normalizedJson =
      JSON.stringify(
        normalizedCart
      );

    if (
      originalJson !==
      normalizedJson
    ) {
      localStorage.setItem(
        CART_KEY,
        normalizedJson
      );
    }

    return normalizedCart;
  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error
    );

    return [];
  }
}

/**
 * =====================================================
 * SAVE CART
 * =====================================================
 *
 * Normalizes the cart before saving.
 */
export function saveCart(
  cart: CartItem[]
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    const normalizedCart =
      normalizeCart(cart);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(
        normalizedCart
      )
    );

    window.dispatchEvent(
      new Event(
        CART_UPDATED_EVENT
      )
    );
  } catch (error) {
    console.error(
      "SAVE CART ERROR:",
      error
    );
  }
}

/**
 * =====================================================
 * ADD TO CART
 * =====================================================
 *
 * Same product + same variant:
 * increase quantity.
 *
 * Different variant:
 * create a separate cart line.
 */
export function addToCart(
  item: CartItem
): CartItem[] {
  const cart = getCart();

  const productId = Number(
    item.product_id
  );

  const variantId = Number(
    item.variant_id
  );

  const quantity = Math.max(
    1,
    Number(item.quantity) || 1
  );

  const existingIndex =
    cart.findIndex(
      (cartItem) =>
        Number(
          cartItem.product_id
        ) === productId &&
        Number(
          cartItem.variant_id
        ) === variantId
    );

  if (
    existingIndex >= 0
  ) {
    cart[existingIndex] = {
      ...cart[existingIndex],

      quantity:
        cart[existingIndex]
          .quantity +
        quantity,
    };
  } else {
    cart.push({
      ...item,

      product_id:
        productId,

      variant_id:
        variantId,

      quantity,
    });
  }

  saveCart(cart);

  return getCart();
}

/**
 * =====================================================
 * UPDATE CART QUANTITY
 * =====================================================
 */
export function updateCartQuantity(
  productId: number,
  variantId: number,
  quantity: number
): CartItem[] {
  const cart = getCart();

  const safeQuantity =
    Math.max(
      1,
      Number(quantity) || 1
    );

  const updatedCart =
    cart.map((item) => {
      const sameProduct =
        Number(
          item.product_id
        ) ===
        Number(productId);

      const sameVariant =
        Number(
          item.variant_id
        ) ===
        Number(variantId);

      if (
        sameProduct &&
        sameVariant
      ) {
        return {
          ...item,
          quantity:
            safeQuantity,
        };
      }

      return item;
    });

  saveCart(updatedCart);

  return getCart();
}

/**
 * =====================================================
 * REMOVE FROM CART
 * =====================================================
 */
export function removeFromCart(
  productId: number,
  variantId: number
): CartItem[] {
  const cart = getCart();

  const updatedCart =
    cart.filter(
      (item) =>
        !(
          Number(
            item.product_id
          ) ===
            Number(productId) &&
          Number(
            item.variant_id
          ) ===
            Number(variantId)
        )
    );

  saveCart(updatedCart);

  return getCart();
}

/**
 * =====================================================
 * CLEAR CART
 * =====================================================
 */
export function clearCart(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    localStorage.removeItem(
      CART_KEY
    );

    window.dispatchEvent(
      new Event(
        CART_UPDATED_EVENT
      )
    );
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );
  }
}

/**
 * =====================================================
 * CART ITEM COUNT
 * =====================================================
 *
 * Example:
 *
 * Product A quantity 2
 * Product B quantity 3
 *
 * Result = 5
 */
export function getCartItemCount(
  cart?: CartItem[]
): number {
  const items =
    cart ?? getCart();

  return items.reduce(
    (total, item) =>
      total +
      Math.max(
        0,
        Number(item.quantity) ||
          0
      ),
    0
  );
}

/**
 * =====================================================
 * CART SUBTOTAL
 * =====================================================
 */
export function getCartSubtotal(
  cart?: CartItem[]
): number {
  const items =
    cart ?? getCart();

  return items.reduce(
    (total, item) => {
      const price =
        Number(item.price);

      const quantity =
        Math.max(
          0,
          Number(item.quantity) ||
            0
        );

      return (
        total +
        price * quantity
      );
    },
    0
  );
}

/**
 * =====================================================
 * CART UPDATED LISTENER
 * =====================================================
 */
export function onCartUpdated(
  callback: () => void
): () => void {
  if (
    typeof window === "undefined"
  ) {
    return () => {};
  }

  window.addEventListener(
    CART_UPDATED_EVENT,
    callback
  );

  return () => {
    window.removeEventListener(
      CART_UPDATED_EVENT,
      callback
    );
  };
}