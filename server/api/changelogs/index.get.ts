export default defineEventHandler(async (event) => {
  try {
    const db = useDb();
    const result = await db.query('SELECT slug FROM changelogs ORDER BY slug DESC');
    
    return {
      code: 0,
      data: result.rows,
      message: 'Success',
    };

  } catch (error) {
    console.error('Error fetching changelog list:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch changelogs',
    });
  }
});
