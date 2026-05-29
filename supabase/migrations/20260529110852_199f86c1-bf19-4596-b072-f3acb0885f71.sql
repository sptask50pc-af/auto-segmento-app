-- 1. Remove client-side order insertion to prevent price manipulation.
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
REVOKE INSERT ON public.orders FROM authenticated, anon;

-- 2. Restrict listing of product-images bucket; public URL access still works.
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;

CREATE POLICY "Admins can list product images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
