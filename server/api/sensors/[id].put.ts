import { eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { getUserProjects } from '~/server/database/repositories/projectsRepository'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors, sensorsUpdateSchema } from '~/server/database/schemas/sensors.schema'
import { sensorsToVariables } from '~/server/database/schemas/sensorsToVariables.schema'
import { getNumericIdFromRouteParams, getUserFromEvent } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  const variablesSchema = z.object({
    variables: z.array(z.number()),
  })
  const db = useDB()

  const userProjects = await getUserProjects(db, user.id, { id: projects.id })

  const sensorId = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, sensorsUpdateSchema.pick({
    name: true,
    description: true,
    project: true,
  }).merge(variablesSchema).parse)

  if (!userProjects.map(project => project.id).includes(body.project)) {
    return createError({
      statusCode: 403,
      message: 'No tienes permisos para modificar este sensor',
    })
  }

  const sensor = await getSensorById(db, sensorId)

  if (!sensor) {
    return createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  const updatedSensorData = {
    ...body,
    variables: undefined,
  }

  const returningValue = (await db.update(sensors).set(updatedSensorData).where(eq(sensors.id, sensorId)).returning()).at(0)!

  const sensorVariablesRelation = await db.select().from(sensorsToVariables).where(eq(sensorsToVariables.sensorId, sensorId))
  const existingVariables = sensorVariablesRelation.map(relation => relation.variableId)

  const toDeleteRelation = sensorVariablesRelation.filter(relation => !body.variables.includes(relation.variableId))
  const toInsertRelations = body.variables.filter(variable => !existingVariables.includes(variable))

  if (toDeleteRelation.length)
    await db.delete(sensorsToVariables).where(inArray(sensorsToVariables.variableId, toDeleteRelation.map(relation => relation.variableId)))

  if (toInsertRelations.length) {
    await db.insert(sensorsToVariables).values(toInsertRelations.map(variableId => ({
      sensorId,
      variableId,
    })))
  }

  return returningValue
})
