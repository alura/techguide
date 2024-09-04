import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../../error.js';
//Regex for the various letter subclasses of the Library of Congress Classification
//As defined in the pdfs available by clicking on the letters at this link
//https://www.loc.gov/catdir/cpso/lcco/
const LCC_SUBCLASS_PREFIX = /^((AC|AE|AG|AI|AM|AN|AP|AS|AY|AZ)|[B][CDFHJLMPQRSTVX]{0,1}|[C][BCDEJNRST]{0,1}|[D][AWBCDEFGH]{0,1}|[E]|[F]|[G][ABCEFNRTV]{0,1}|[H][ABCDEFGJMNQSTVX]{0,1}|[J][ACFJKLNQSVXZ]{0,1}|(K|KB[M,P,R,U]|KD[C,E,G,K,Z]{0,1}|KE[ABMNOPQSYZ]{0,1}|KF[ACDFGHIKLMNOPRSTUVWXZ]{0,1}|KG[ABCDEFGHJKLMNPQRSTUVWXYZ]{0,1}|KH[ACDFHKLMNPQSUW]{0,1}|KJ[ACEGHJKMNPRSTVW]{0,1}|KK[ABEFGHIJKLMNPQRSTVWXYZ]{0,1}|KL[ABDEFHMNPQRSTVW]{0,1}|KM[CEFGHJKLMNPQSTUVXY]{0,1}|KN[CEFGHKLMNPQRSTUVWXY]{0,1}|KP[ACEFGHJKLMPSTVW]{0,1}|KQ[CEGHJKMPTVWX]{0,1}|KR[BCEGKLMNPRSUVWXY]{0,1}|KS[ACEGHKLNPRSTUVWXYZ]{0,1}|KT[ACDEFGHJKLNQRTUVWXYZ]{0,1}|KU[ABCDEFGHNQ]{0,1}|KV[BCEHLMNPQRSUW]{0,1}|KW[ACEGHLPQRTWX]{0,1}|KZ[AD]{0,1})|[L][ABCDEFGHJT]{0,1}|[M][LT]{0,1}|[N][ABCDEKX]{0,1}|[P][ABCDEFGHJKLMNQRSTZ]{0,1}|[Q][ABCDEHKLMPR]{0,1}|[R][ABCDEFGJKLMSTVXZ]{0,1}|[S][BDFHK]{0,1}|[T][ACDEFGHJKLNPRSTX]{0,1}|[U][ABCDEFGH]{0,1}|[V][ABCDEFGKM]{0,1}|[Z][A]{0,1})$/;
const validate = (value, ast) => {
    if (typeof value !== 'string') {
        throw createGraphQLError(`Value is not string: ${value}`, { nodes: ast });
    }
    if (!LCC_SUBCLASS_PREFIX.test(value)) {
        throw createGraphQLError(`Value is not a valid LCC Subclass: ${value}`, { nodes: ast });
    }
    return value;
};
const specifiedByURL = 'https://www.loc.gov/catdir/cpso/lcco/';
export const GraphQLLCCSubclassConfig = {
    name: 'LCCSubclass',
    description: `A field whose value conforms to the Library of Congress Subclass Format ttps://www.loc.gov/catdir/cpso/lcco/`,
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw createGraphQLError(`Can only validate strings as LCC Subclasses but got a: ${ast.kind}`, { nodes: ast });
        }
        return validate(ast.value, ast);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'DeweyDecimal',
            type: 'string',
            pattern: LCC_SUBCLASS_PREFIX.source,
        },
    },
};
export const GraphQLLCCSubclass = /*#__PURE__*/ new GraphQLScalarType(GraphQLLCCSubclassConfig);
