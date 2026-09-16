-- Migration to allow deletion of orders
CREATE POLICY IF NOT EXISTS "orders_delete_all" ON public.orders FOR DELETE USING (true);
