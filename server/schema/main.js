const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean} = require('graphql')

const DelegationType = new GraphQLObjectType({
  name: 'Delegation',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    name: {
      type: GraphQLString
    },
    isObserver: {
      type: GraphQLBoolean
    },
    committee: {
      type: CommitteeType,
      resolve: (object, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('committees').find({}).toArray((err, result) => {
            return resolve(result[0] || null)
          })
        })
      }
    }
  })
})

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    committee: {
      type: CommitteeType,
      resolve: (obj, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('committees')
          .find({
            name: obj.committee
          })
          .toArray((err, result) => {
            return resolve(result)
          })
        })
      }
    },
    text: {
      type: GraphQLString
    }
  })
})

const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    question: {
      type: QuestionType,
      resolve: ({question}, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('questions').find({question})
          .toArray((err, result) => {
            return resolve(result[0] || null)
          })
        })
      }
    },
    text: {
      type: GraphQLString
    },
    delegate: {
      type: GraphQLString
    }
  })
})

const RegisterOptionType = new GraphQLObjectType({
  name: 'RegisterOption',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    delegate: {
      type: DelegateType
    },
    committee: {
      type: CommitteeType
    },
    delegation1: {
      type: DelegationType
    },
    delegation2: {
      type: DelegationType
    },
    answers: {
      type: new GraphQLList(AnswerType)
    }
  })
})

const DelegateType = new GraphQLObjectType({
  name: 'Delegate',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    firstName: {
      type: GraphQLString
    },
    lastName1: {
      type: GraphQLString
    },
    lastName2: {
      type: GraphQLString
    },
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName1, lastName2}) => `${firstName} ${lastName1} ${lastName2}`
    },
    level: {
      type: GraphQLString
    },
    institution: {
      type: GraphQLString
    },
    grade: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    mobile: {
      type: GraphQLString
    },
    facebook: {
      type: GraphQLString
    },
    aboutTheEvent: {
      type: GraphQLString
    },
    firstOption: {
      type: RegisterOptionType
    },
    secondOption: {
      type: RegisterOptionType
    },
    facultyAdvisor: {
      type: FacultyType
    }
  })
})

const FacultyType = new GraphQLObjectType({
  name: 'Faculty',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    firstName: {
      type: GraphQLString
    },
    lastName1: {
      type: GraphQLString
    },
    lastName2: {
      type: GraphQLString
    },
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName1, lastName2}) => `${firstName} ${lastName1} ${lastName2}`
    },
    level: {
      type: GraphQLString
    },
    institution: {
      type: GraphQLString
    },
    grade: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    mobile: {
      type: GraphQLString
    },
    facebook: {
      type: GraphQLString
    },
    aboutTheEvent: {
      type: GraphQLString
    },
    delegationName: {
      type: GraphQLString
    },
    belongingDelegates: {
      type: new GraphQLList(DelegateType),
      resolve: ({belongingDelegates}, args, {db}) => {
        return new Promise(resolve => {
          db.collection('delegates').find({'_id': {$in: belongingDelegates}})
          .toArray((err, result) => {
            return resolve(result || [])
          })
        })
      }
    }
  })
})

const CommitteeType = new GraphQLObjectType({
  name: 'Committee',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({_id}) => _id
    },
    name: {
      type: GraphQLString
    },
    topics: {
      type: new GraphQLList(GraphQLString),
      resolve: () => []
    },
    delegations: {
      type: new GraphQLList(DelegationType),
      args: {
        delegationType: {
          type: GraphQLString
        }
      },
      resolve: (obj, {delegationType}, {db}) => {
        return new Promise((resolve) => {
          db.collection('delegations')
          .find(Object.assign({}, {
            committee: obj.name
          }, delegationType ? {
            type: delegationType
          } : {})).toArray((err, result) => {
            return resolve(result)
          })
        })
      }
    },
    questionnaire: {
      type: new GraphQLList(QuestionType),
      resolve: (obj, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('questions')
          .find({
            committee: obj.name
          })
          .toArray((err, result) => {
            resolve(result || null)
          })
        })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    faculties: {
      type: new GraphQLList(FacultyType),
      resolve: (obj, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('faculties').find({})
          .toArray((err, result) => {
            resolve(result || [])
          })
        })
      }
    },
    committee: {
      type: CommitteeType,
      args: {
        name: {
          type: GraphQLString
        }
      },
      resolve: (obj, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('committees').find({
            name: args.name
          }).toArray((err, result) => {
            return resolve(result[0] || null)
          })
        })
      }
    },
    allCommittees: {
      type: new GraphQLList(CommitteeType),
      resolve: (obj, args, {db}) => {
        return new Promise((resolve) => {
          db.collection('committees').find({}).toArray((err, result) => {
            return resolve(result || [])
          })
        })
      }
    }
  })
})

const appSchema = new GraphQLSchema({
  query: RootQuery
})

module.exports = appSchema
