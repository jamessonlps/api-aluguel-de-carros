import { AppError } from "@shared/errors/AppError";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory);
  });
  
  it('Should be able to create a new category', async() => {
    const category = {
      name: 'Category name test',
      description: 'Category description test',
    }

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    const created = await categoriesRepositoryInMemory.findByName(category.name);
  
    expect(created).toHaveProperty('id');
  });
  
  it('Should not be able to create a new category if the category name already exists', async() => {
    expect(async() => {
      const category = {
        name: 'Category name test',
        description: 'Category description test',
      }
  
      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });
  
      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})