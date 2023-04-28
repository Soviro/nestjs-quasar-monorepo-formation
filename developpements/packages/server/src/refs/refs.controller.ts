import { LoggerService } from '@formation/servers-lib/dist/services'
import { AbstractController } from '@formation/servers-lib/dist/utils'
import {
  CodeLabelResultDto,
  IPaginatedListDto,
  ISearchDto,
  OffreReferenceResultDto,
  ProductDto,
  SearchProductDto,
  WorkDone
} from '@formation/shared-lib'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { RefsService } from './refs.service'
import { ApiBody } from '@nestjs/swagger'

@Controller('refs')
export class RefsController extends AbstractController {

  constructor(
    private readonly logger: LoggerService,
    private readonly refsService: RefsService
  ) {
    super()
    this.logger.info('RefsController created')
  }

  @Get('/campagne/:codeCampagne/offres-ref/:codeOffre')
  async findOffreReference(@Param('codeCampagne') codeCampagne: string,
    @Param('codeOffre') codeOffre: string): Promise<WorkDone<OffreReferenceResultDto>> {
    const wd = await this.refsService.searchOffreReference(parseInt(codeCampagne, 10), codeOffre)
    if (wd.isOk && !!wd.data) {
      // Mise à jour de la date de dernière modification
      return this.refsService.updateOffreReferenceDateDerniereModification(wd.data[0])
    }
    return WorkDone.toError(wd)
  }

  @Get('/fichparts')
  async getAllFichParts(): Promise<WorkDone<CodeLabelResultDto[]>> {
    return this.refsService.getAllFichParts()                             //retourne list de CodeLabelResultDto (avec code et label). WorkDone --> c'est bien passé ou pas.
  }

  @Get('/campagne/:codeCampagne/offres-ref')
  async searchOffresReferences(@Param('codeCampagne') codeCampagne: string,
    @Query('codeProduit') codeProduit?: string): Promise<WorkDone<OffreReferenceResultDto[]>> {
    return this.refsService.searchOffreReference(parseInt(codeCampagne, 10), null, codeProduit)
  }

  @Get('produits')
  async getProduits(@Query('search') search: string): Promise<WorkDone<ProductDto[]>> {
    return this.refsService.getProduits(search);
  }

  @Post('produits')
  @ApiBody({})
  async createProduit(@Body() product: ProductDto): Promise<WorkDone<ProductDto>> {
    return this.refsService.createProduit(product);
  }

  @Get('products')
  async getProductsByCriterias(@Query() searchCriterias: ISearchDto<SearchProductDto>): Promise<WorkDone<IPaginatedListDto<ProductDto>>>{
    return this.refsService.getProductsByCriterias(searchCriterias);
  }

  @Get('/produits/:code')
  async getProduitsByCode(@Param('code') code: string): Promise<WorkDone<ProductDto>> {
    return this.refsService.getProduitsByCode(code);
  }

  @Put('produits/:code')
  @ApiBody({})
  async updateProduit(@Param('code') code: string, @Body() product: ProductDto): Promise<WorkDone<ProductDto>> {
    return this.refsService.updateProduit(code, product);
  }

  @Delete('produits/delete/:code')
  async deleteProduit(@Param('code') code: string): Promise<WorkDone<string>> {
    return this.refsService.deleteProduit(code);
  }

}
