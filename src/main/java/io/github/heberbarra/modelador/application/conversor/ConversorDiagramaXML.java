package io.github.heberbarra.modelador.application.conversor;

import io.github.heberbarra.modelador.domain.model.xml.DiagramaXML;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Marshaller;
import java.io.File;

public class ConversorDiagramaXML {

    public File salvar(DiagramaXML diagrama) throws Exception {

        JAXBContext context = JAXBContext.newInstance(DiagramaXML.class);
        Marshaller marshaller = context.createMarshaller();

        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

        File arquivo = new File("diagram.xml");
        marshaller.marshal(diagrama, arquivo);

        return arquivo;
    }
}
