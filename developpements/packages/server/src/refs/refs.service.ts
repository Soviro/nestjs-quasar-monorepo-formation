import {
  LoggerService,
  PrismaService
} from '@formation/servers-lib/dist/services'
import { convertDbPartenaireToCodeLabelResultDto } from '@formation/servers-lib/dist/utils/prisma-dto-converters'
import {
  CodeLabelResultDto,
  IPaginatedListDto,
  IPagination,
  ISearchDto,
  OffreReferenceResultDto,
  ProductDto,
  SearchProductDto,
  WorkDone
} from '@formation/shared-lib'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RefsService {

  constructor(
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger.info('RefsService created')
  }

  async getAllFichParts(): Promise<WorkDone<CodeLabelResultDto[]>> {                               //acces base de données qui fait un select, mais pas de mis a jour

    const dbPartenaires = await this.prismaService.partenaire.findMany({
      orderBy: {
        code: 'asc'
      }
    })

    if (!dbPartenaires) {
      return WorkDone.buildError('Une erreur est survenue durant la récupération des partenaires.')
    }
    return WorkDone.buildOk<CodeLabelResultDto[]>(dbPartenaires.map(convertDbPartenaireToCodeLabelResultDto))               //We need only Code and Label, so convert DbPartenaire to just that
  }

  async searchOffreReference(codeCampagne: number, codeOffre?: string, codeProduit?: string): Promise<WorkDone<OffreReferenceResultDto[]>> {
    return WorkDone.buildOk([
      { codeCampagne: 202201, codeOffre: 'OF01', libelleOffre: 'Offre #01', codeProduit: 'PR01', dateDerniereModification: new Date() },
      { codeCampagne: 202201, codeOffre: 'OF01', libelleOffre: 'Offre #01', codeProduit: 'PR02', dateDerniereModification: new Date() },
      { codeCampagne: 202201, codeOffre: 'OF02', libelleOffre: 'Offre #02', codeProduit: 'PR07', dateDerniereModification: new Date() }
    ])
    // return this.oracleDbService.executeQuery<OffreReferenceResultDto>(
    //   `SELECT CD_CAMP, CD_OFFRREFE, LB_OFFRREFE, CD_PROD, DT_MODI
    //    FROM ADLMASTER_OWNER.OFFRE_REFERENCE
    //    WHERE CD_CAMP = :codeCampagne
    //      AND (:hasCodeOffre = 0 OR CD_OFFRREFE = :codeOffre)
    //      AND (:hasCodeProduit = 0 OR CD_PROD = :codeProduit)
    //    ORDER BY CD_CAMP, CD_OFFRREFE, CD_PROD`,
    //   {
    //     queryBindings: {
    //       codeCampagne: { dir: ORACLE_BIND_IN, type: DB_TYPE_NUMBER, val: codeCampagne },
    //       hasCodeOffre: { dir: ORACLE_BIND_IN, type: DB_TYPE_NUMBER, val: !!codeOffre ? 1 : 0 },
    //       codeOffre: { dir: ORACLE_BIND_IN, type: DB_TYPE_VARCHAR, val: codeOffre },
    //       hasCodeProduit: { dir: ORACLE_BIND_IN, type: DB_TYPE_NUMBER, val: !!codeProduit ? 1 : 0 },
    //       codeProduit: { dir: ORACLE_BIND_IN, type: DB_TYPE_VARCHAR, val: codeProduit }
    //     },
    //     rowMapper: (row) => {
    //       return {
    //         codeCampagne: row.CD_CAMP,
    //         codeOffre: row.CD_OFFRREFE,
    //         libelleOffre: row.LB_OFFRREFE,
    //         codeProduit: row.CD_PROD,
    //         dateDerniereModification: row.DT_MODI
    //       }
    //     }
    //   })
  }

  async updateOffreReferenceDateDerniereModification(offreReference: OffreReferenceResultDto): Promise<WorkDone<OffreReferenceResultDto>> {

    // await this.oracleDbService.executeQuery<number>(
    //   `UPDATE ADLMASTER_OWNER.OFFRE_REFERENCE
    //    SET DT_MODI = CURRENT_DATE
    //    WHERE CD_CAMP = :codeCampagne
    //      AND CD_OFFRREFE = :codeOffre`,
    //   {
    //     queryBindings: {
    //       codeCampagne: { dir: ORACLE_BIND_IN, type: DB_TYPE_NUMBER, val: offreReference.codeCampagne },
    //       codeOffre: { dir: ORACLE_BIND_IN, type: DB_TYPE_VARCHAR, val: offreReference.codeOffre }
    //     },
    //     isTransaction: true
    //   })
    //
    // const newOffreReference = await this.searchOffreReference(offreReference.codeCampagne, offreReference.codeOffre)
    //
    // if (newOffreReference.isOk && newOffreReference.data) {
    //   return (newOffreReference.data.length > 0) ? WorkDone.buildOk(newOffreReference.data[0]) : WorkDone.buildError(`Update date in Offre Reference error
    // !`) } else { return WorkDone.toError(newOffreReference) }
    return WorkDone.buildOk(offreReference)
  }

  async getProduits(search: string): Promise<WorkDone<ProductDto[]>> {


    const filter = `%${ search }%`
    const dbProducts = await this.prismaService.produit.findMany({
      where: {
        libelle: {
          contains: search,
          mode: 'insensitive'
        }
      },
      orderBy: {
        libelle: 'asc'
      }
    })

    if (!dbProducts) {
      return WorkDone.buildError('Une erreur est survenue durant la récupération des produits.')
    }
    return WorkDone.buildOk(dbProducts)
  }

  async getProductsByCriterias(searchCriterias: ISearchDto<SearchProductDto>): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {     

    const criterias : SearchProductDto = JSON.parse(searchCriterias.criterias.toString())
    const pagination: IPagination = JSON.parse(searchCriterias.pagination.toString())                                      
    let listDbProducts: IPaginatedListDto<ProductDto> = {list: [], rowsNumber: 0}

    const dbProducts = await this.prismaService.produit.findMany({
      skip: (pagination.page-1) * pagination.rowsPerPage,
      take: pagination.rowsPerPage,
      where: {
        libelle: {
          contains: criterias.labelLike,
          mode: 'insensitive'
        }
      },
      orderBy: {
        libelle: 'asc'
      }
    })

    const dbProductsTot = await this.prismaService.produit.findMany({
        where: {
        libelle: {
          contains: criterias.labelLike,
          mode: 'insensitive'
        }
      }
    })

    listDbProducts.list = dbProducts
    listDbProducts.rowsNumber = dbProductsTot.length
    this.logger.debug(JSON.stringify(listDbProducts))

    if (!dbProducts) {
      return WorkDone.buildError('Une erreur est survenue durant la récupération des produits.')
    }
    return WorkDone.buildOk(listDbProducts)
  }


  async getProduitsByCode(code: string): Promise<WorkDone<ProductDto>> {
    // return WorkDone.buildOk({code: code, libelle: `Produit ${code}`})
    const dbProduct = await this.prismaService.produit.findUnique({
      where: {
        code: code
      }
    })

    if (!dbProduct) {
      return WorkDone.buildError('Aucun produit ne correspond au code saisi.')
    }
    return WorkDone.buildOk(dbProduct)
  }

  async createProduit(product: ProductDto): Promise<WorkDone<ProductDto>> {
    //Check if product with same code already exists

    if ((await this.getProduitsByCode(product.code)).isOk) {

      return WorkDone.buildError(`Ce produit avec le code ${product.code} existe déjà`)

    }

    this.logger.info(`creating: ${JSON.stringify(product)}...`)
    //try{
    const dbProduct = await this.prismaService.produit.create({ data: product })

    if (!dbProduct) {
      return WorkDone.buildError('Aucun produit crée.')
    }
    return WorkDone.buildOk(dbProduct)
  }
  // catch (e) {
  //   return WorkDone.buildError(JSON.stringify(e))
  // }
  // }


  async updateProduit(code: string, product: ProductDto): Promise<WorkDone<ProductDto>> {
    //Check if product with same code already exists
    try {
      const wd: WorkDone<ProductDto> = await this.getProduitsByCode(code)
      if (!wd.isOk) {
        return wd
      }

      //Updating libelle field

      this.logger.info(`modifying: ${code} => ${JSON.stringify(product)}...`)

      const dbProduct = await this.prismaService.produit.update({
        where: {
          code: code
        },
        data: {
          libelle: product.libelle,
          commentaire: product.commentaire
        }
      })

      return WorkDone.buildOk(dbProduct)
    }
    catch (e) {
      return WorkDone.buildError(e.message)
    }
  }

  async deleteProduit(code: string): Promise<WorkDone<string>> {
    const wd = await this.getProduitsByCode(code)
    if (!wd.isOk) {
      return WorkDone.buildError(wd.error.message)
    }

    //Deleting produit

    this.logger.info(`deleting: ${code} ...`)

    await this.prismaService.produit.delete({
      where: {
        code: code
      }
    })


    return WorkDone.buildOk('deleted')
  }


}

