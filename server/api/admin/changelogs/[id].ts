export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const db = useDb();

  if (!id || isNaN(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID provided',
    });
  }

  const numericId = parseInt(id);

  // --- Handle different HTTP methods ---

  // UPDATE a changelog
  if (event.method === 'PUT') {
    const body = await readBody(event);
    if (!body.slug || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing slug or content',
      });
    }

    try {
      await db.query(
        'UPDATE changelogs SET slug = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [body.slug, body.content, numericId],
      );
      return { code: 0, message: 'Changelog updated successfully' };
    } catch (error: any) {
      if (error.code === '23505') {
        throw createError({
          statusCode: 409,
          statusMessage: 'A changelog with this slug already exists.',
        });
      }
      console.error(`Error updating changelog ${numericId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update changelog',
      });
    }
  }

  // DELETE a changelog
  if (event.method === 'DELETE') {
    try {
      const result = await db.query('DELETE FROM changelogs WHERE id = $1', [
        numericId,
      ]);
      if (result.rowCount === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Changelog not found',
        });
      }
      return { code: 0, message: 'Changelog deleted successfully' };
    } catch (error) {
      console.error(`Error deleting changelog ${numericId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete changelog',
      });
    }
  }

  // GET a single changelog by ID (default for this file)
  try {
    const result = await db.query(
      'SELECT id, slug, content FROM changelogs WHERE id = $1',
      [numericId],
    );
    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Changelog not found',
      });
    }
    return { code: 0, data: result.rows[0], message: 'Success' };
  } catch (error) {
    console.error(`Error fetching changelog ${numericId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch changelog',
    });
  }
});
