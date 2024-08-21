export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  static createFromText(text: string) {
    const slugText = text
      .toLowerCase() // Converte a string para minúsculas
      .normalize('NFD') // Separa os caracteres acentuados em suas partes base
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim() // Remove espaços no início e no final
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-'); // Remove hífens duplicados

    return new Slug(slugText);
  }
}
