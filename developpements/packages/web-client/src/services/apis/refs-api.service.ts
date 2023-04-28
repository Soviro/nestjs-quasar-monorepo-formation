import {
  CodeLabelResultDto,
  IPaginatedListDto,
  ISearchDto,
  ProductDto,
  SearchProductDto,
  WorkDone
} from '@formation/shared-lib'
import { AxiosInstance } from 'axios'
import { AbstractApiService } from './abstract-api.service'

export class RefsApiService extends AbstractApiService {

  constructor(axiosInstance: AxiosInstance, serviceApiBaseUrl: string) {
    super(axiosInstance, serviceApiBaseUrl)
  }

  // Get "cdFichPart"'s customers list according to search criterias
  public async getAllFichierPartenaires(): Promise<WorkDone<CodeLabelResultDto[]>> {
    return this.doGet<CodeLabelResultDto[]>('/fichparts')
  }

  async createProduit(product: ProductDto): Promise<WorkDone<ProductDto>> {
    return this.doPost('/produits', product);
  }

  public async getProductListByCriterias(searchCriterias: ISearchDto<SearchProductDto>): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/products', searchCriterias)
  }

  public async getProduitDetailles(code: string): Promise<WorkDone<ProductDto>> {
    return this.doGet<ProductDto>(`/produits/${code}`)
  }

  async updateProduitChoisi(code: string, product: ProductDto): Promise<WorkDone<ProductDto>> {
    return this.doPut(`/produits/${code}`, product);
  }

  async deleteProduitChoisi(code: string): Promise<WorkDone<string>> {
    return this.doDelete(`/produits/delete/${code}`);
  }

  async getProduitsByLibelle(libelle: string): Promise<WorkDone<ProductDto>> {
    return this.doGet(`/produits/libelle/${libelle}`);
  }
}
