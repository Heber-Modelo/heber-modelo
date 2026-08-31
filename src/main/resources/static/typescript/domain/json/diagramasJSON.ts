/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *    https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

import AbaJSON from "domain/json/abaJSON";
import ComponenteJSON from "domain/json/componenteJSON";
import DescricaoRelacionalJSON from "domain/json/descricaoRelacionalJSON";
import DicionarioDadosJSON from "domain/json/dicionarioDadosJSON";

export default interface DiagramasJSON {
  creationDate: Date;
  loadedCSSFiles: string[];
  types: string[];

  tabs: AbaJSON[];
  components: ComponenteJSON[];
  relationalDescriptions: DescricaoRelacionalJSON[];
  dataDictionaries: DicionarioDadosJSON[];
}
