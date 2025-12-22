export default defineEventHandler(async (event) => {
  try {
    const db = useDb();
    // Fetch id and slug for the admin list view
    const result = await db.query(
      'SELECT id, slug, created_at FROM changelogs ORDER BY created_at DESC',
    );

    return {
      code: 0,
      data: result.rows,
      message: 'Success',
    };
  } catch (error) {
    console.error('Error fetching changelog list for admin:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch changelogs',
    });
  }
});
