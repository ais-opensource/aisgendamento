
import { success, failure } from './libs/response-lib'
import * as dynamoDB from './libs/dynamo-db-lib'
import uuid from 'uuid'

export async function addExperiencia(event, context, callback) {
  const data = JSON.parse(event.body)
  const params = {
    TableName: 'aisgendamento-experiencias',
    Item: {
      userId: event.requestContext.authorizer.claims.sub,
      experienciaId: uuid.v1(),
      nome: data.nome,
      duracao: data.duracao,
      preco: data.preco,
      genero: data.genero,
      nivelAdrenalina: data.nivelAdrenalina,
    },
  }

  try {
    const result = await dynamoDB.call('put', params)
    callback(null, success(params.Item))
  } catch (e) {
    callback(null, failure({ status: false, error: e }))
  }
}

export async function getExperiencia(event, context, callback) {
  const params = {
    TableName: 'aisgendamento-experiencias',
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      experienciaId: event.pathParameters.id,
    },
  }
  try {
    const result = await dynamoDB.call('get', params)
    if (result.Item) {
      callback(null, success(result.Item))
    } else {
      callback(null, failure({ status: false}))
    }
  } catch (e) {
    callback(null, failure({ status:false, error: e}))
  }
}

export async function updateExperiencia(event, context, callback) {
  const data = JSON.parse(event.body)
  const params = {
    TableName: 'aisgendamento-experiencias',
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      experienciaId: event.pathParameters.id,
    },
    UpdateExpression: 'SET nome = :nome, duracao = :duracao, preco = :preco, genero = :genero, nivelAdrenalina = :nivelAdrenalina',
    ExpressionAttributesValues: {
      ':nome': data.nome,
      ':duracao': data.duracao,
      ':preco': data.preco,
      ':genero': data.genero,
      ':nivelAdrenalina': data.nivelAdrenalina
    }
  }
  try {
    const result = dynamoDB.call('update', params)
    callback(null, success({status: true}))
  } catch (e) {
    callback(null, failure({status: false}))
  }
}

export async function deleteExperiencia(event, context, callback) {
  const params = {
    TableName: 'aisgendamento-experiencias',
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      experienciaId: event.pathParameters.id,
    }
  }
  try {
    const result = dynamoDB.call('delete', params)
    callback(null, success({status: true}))
  } catch (e) {
    callback(null, sucess({ status: false, error: e}))
  }
}

export async function getExperiencias(event, context, callback) {
  const params = {
    Tablename: 'aisgendamento-experiencias',
  }
  try {
    const result = dynamoDB.call('scan', params)
    callback(null, success({ status: true}))
  } catch (e) {
    callback(null, failure({ status: false, error: e}))
  }
}
