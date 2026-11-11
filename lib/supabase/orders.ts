import { supabase, WIZARD_TREE_COMPANY_ID } from './client';

export interface DbOrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  product_image?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at?: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  address: string;
  total_cost: number;
  currency: string;
  status: 'pending' | 'in_progress' | 'paid' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: DbOrderItem[];
}

export interface CreateOrderInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  address: string;
  total_cost: number;
  currency?: string;
  notes?: string;
  items: Array<{
    product_id?: string | null;
    product_name: string;
    product_image?: string | null;
    unit_price: number;
    quantity: number;
    total_price: number;
  }>;
}

/**
 * Places a customer order and inserts all related order items in a transaction.
 */
export async function placeOrder(input: CreateOrderInput): Promise<DbOrder> {
  if (!WIZARD_TREE_COMPANY_ID) {
    throw new Error('Company ID is missing from environment.');
  }

  // Generate readable order number e.g. WT-84920
  const orderNumber = `WT-${Math.floor(10000 + Math.random() * 90000)}`;

  // 1. Insert order header
  const { data: order, error: orderError } = await supabase
    .from('wizard_tree_orders')
    .insert({
      order_number: orderNumber,
      company_id: WIZARD_TREE_COMPANY_ID,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      phone_number: input.phone_number || null,
      country: input.country,
      city: input.city,
      state: input.state,
      postal_code: input.postal_code,
      address: input.address,
      total_cost: input.total_cost,
      currency: input.currency || 'USD',
      status: 'pending',
      notes: input.notes || null,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(`Failed to place order: ${orderError?.message}`);
  }

  // 2. Insert order items
  if (input.items && input.items.length > 0) {
    const itemsToInsert = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      product_image: item.product_image || null,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from('wizard_tree_order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
    }
  }

  return order as DbOrder;
}

/**
 * Fetches all orders for the admin dashboard, including their items.
 */
export async function fetchCompanyOrders(status?: string): Promise<DbOrder[]> {
  if (!WIZARD_TREE_COMPANY_ID) {
    return [];
  }

  let query = supabase
    .from('wizard_tree_orders')
    .select(`
      *,
      items:wizard_tree_order_items(*)
    `)
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return (data || []) as DbOrder[];
}

/**
 * Updates order status (e.g. pending -> in_progress -> paid -> cancelled)
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'in_progress' | 'paid' | 'cancelled'
): Promise<DbOrder> {
  const { data, error } = await supabase
    .from('wizard_tree_orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('company_id', WIZARD_TREE_COMPANY_ID)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return data as DbOrder;
}

