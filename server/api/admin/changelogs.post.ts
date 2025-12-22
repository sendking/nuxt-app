export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.slug || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing slug or content',
      });
    }

    const db = useDb();
    const result = await db.query(
      'INSERT INTO changelogs (slug, content) VALUES ($1, $2) RETURNING id',
      [body.slug, body.content],
    );

    return {
      code: 0,
      data: result.rows[0], // Returns { id: ... }
      message: 'Changelog created successfully',
    };
  } catch (error: any) {
    console.error('Error creating changelog:', error);
    // Handle potential unique constraint violation for slug
    if (error.code === '23505') {
      // PostgreSQL unique violation
      throw createError({
        statusCode: 409,
        statusMessage: 'A changelog with this slug already exists.',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create changelog',
    });
  }
});
