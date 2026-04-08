SELECT * FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN products p ON o.product_id = p.id
WHERE u.created_at > '2020-01-01'
ORDER BY o.total DESC;
