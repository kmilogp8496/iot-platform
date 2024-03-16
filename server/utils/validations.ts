import { and, eq } from 'drizzle-orm'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { variables } from '~/server/database/schemas/variables.schema'
import type { DB } from '~/server/utils/db'

export async function validateLocationBelongsToUserProjects(locationId: number, userId: number, db: DB) {
  const location = (
    await db.select({ id: locations.id })
      .from(locations)
      .where(
        and(
          eq(locations.id, locationId),
          eq(projects.createdBy, userId),
        ),
      ).leftJoin(projects, eq(projects.id, locations.project))).at(0)

  if (!location) {
    throw createError({
      statusCode: 404,
      message: 'Ubicación no encontrada',
    })
  }
}

export async function validateVariableExists(variableId: number, db: DB) {
  const variable = (await db.select({ id: variables.id }).from(variables).where(
    eq(variables.id, variableId),
  )).at(0)

  if (!variable) {
    throw createError({
      statusCode: 404,
      message: 'Variable no encontrada',
    })
  }
}

export async function validateProjectBelongsToUser(projectId: number, userId: number, db: DB) {
  const project = (await db.select({ id: projects.id }).from(projects).where(
    and(
      eq(projects.id, projectId),
      eq(projects.createdBy, userId),
    ),
  )).at(0)

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Proyecto no encontrado',
    })
  }
}
