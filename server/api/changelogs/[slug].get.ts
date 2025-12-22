export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug not provided',
    });
  }

  try {
    const db = useDb();
    const result = await db.query('SELECT content FROM changelogs WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Changelog not found',
      });
    }

    return {
      code: 0,
      data: result.rows[0],
      message: 'Success',
    };

  } catch (error: any) {
    // If we threw a 404, re-throw it
    if (error.statusCode === 404) {
      throw error;
    }
    
    console.error(`Error fetching changelog for slug "${slug}":`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch changelog',
    });
  }
});
