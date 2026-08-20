export const agentToolsSchema = [
  {
    name: "get_cart",
    description: "Afficher le contenu actuel du panier de l'utilisateur avec la liste des articles, les quantités, les prix unitaires et le total général.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "search_products",
    description: "Rechercher des produits dans la boutique en fonction de critères de recherche intelligents (nom, description, catégorie, marque, budget min/max).",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "Mots-clés recherchés dans le nom ou la description du produit (ex: routeur wi-fi 6)."
        },
        category: {
          type: "STRING",
          description: "Catégorie de produit (ex: Reseau, Videosurveillance, Domotique)."
        },
        brand: {
          type: "STRING",
          description: "Marque recherchée (ex: Dahua, Hikvision, Ruijie)."
        },
        minPrice: {
          type: "NUMBER",
          description: "Prix minimum en MAD."
        },
        maxPrice: {
          type: "NUMBER",
          description: "Prix maximum en MAD."
        }
      }
    }
  },
  {
    name: "get_product_details",
    description: "Récupérer la fiche technique et les caractéristiques détaillées d'un produit spécifique en utilisant son identifiant unique (productId).",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant unique du produit."
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "compare_products",
    description: "Comparer les caractéristiques techniques, prix et disponibilités de plusieurs produits à la fois à partir de la liste de leurs identifiants (productIds).",
    parameters: {
      type: "OBJECT",
      properties: {
        productIds: {
          type: "ARRAY",
          items: { type: "INTEGER" },
          description: "La liste des identifiants uniques des produits à comparer."
        }
      },
      required: ["productIds"]
    }
  },
  {
    name: "add_to_cart",
    description: "Ajouter un produit du catalogue au panier de l'utilisateur.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit à ajouter."
        },
        quantity: {
          type: "INTEGER",
          description: "La quantité désirée (par défaut 1)."
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "remove_from_cart",
    description: "Retirer un produit du panier de l'utilisateur.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit à retirer."
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "update_cart_quantity",
    description: "Mettre à jour la quantité d'un produit existant dans le panier.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit."
        },
        quantity: {
          type: "INTEGER",
          description: "La nouvelle quantité désirée. Passer 0 pour retirer le produit."
        }
      },
      required: ["productId", "quantity"]
    }
  },
  {
    name: "clear_cart",
    description: "Vider entièrement le panier de l'utilisateur.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "create_order",
    description: "Créer une commande ferme à partir des articles actuellement dans le panier de l'utilisateur connecté.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "get_orders",
    description: "Consulter l'historique et la liste de toutes les commandes passées par l'utilisateur connecté.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "track_order",
    description: "Suivre l'état d'avancement d'une commande spécifique, connaître le transporteur et estimer la date de livraison.",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: {
          type: "INTEGER",
          description: "Le numéro de la commande à suivre."
        }
      },
      required: ["orderId"]
    }
  },
  {
    name: "generate_quote",
    description: "Générer un devis officiel au format PDF à partir des articles du panier, et l'envoyer par email à l'utilisateur.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "convert_quote_to_order",
    description: "Convertir un devis existant en commande active.",
    parameters: {
      type: "OBJECT",
      properties: {
        quoteId: {
          type: "INTEGER",
          description: "Le numéro de devis à convertir."
        }
      },
      required: ["quoteId"]
    }
  },
  {
    name: "get_profile",
    description: "Afficher les coordonnées et informations personnelles du compte de l'utilisateur connecté.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "update_profile",
    description: "Modifier le profil de l'utilisateur connecté (nom, téléphone, entreprise).",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "Nouveau nom complet."
        },
        phone: {
          type: "STRING",
          description: "Nouveau numéro de téléphone."
        },
        company: {
          type: "STRING",
          description: "Nom de l'entreprise."
        }
      }
    }
  },
  {
    name: "get_favorites",
    description: "Afficher la liste des produits favoris (coups de cœur) de l'utilisateur connecté.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "toggle_favorite",
    description: "Ajouter ou retirer un produit de la liste des favoris de l'utilisateur connecté.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit concerné."
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "admin_get_sales_analytics",
    description: "[ADMIN ONLY] Obtenir les statistiques financières de la boutique (chiffre d'affaires global, nombre de commandes, alertes de rupture de stock).",
    parameters: {
      type: "OBJECT",
      properties: {
        period: {
          type: "STRING",
          description: "Période d'analyse : 'day', 'month' ou 'year'.",
          enum: ["day", "month", "year"]
        }
      }
    }
  },
  {
    name: "admin_update_product_stock",
    description: "[ADMIN ONLY] Mettre à jour la quantité de stock disponible d'un produit.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit."
        },
        newStock: {
          type: "INTEGER",
          description: "La nouvelle quantité disponible en stock."
        }
      },
      required: ["productId", "newStock"]
    }
  },
  {
    name: "admin_update_product_price",
    description: "[ADMIN ONLY] Modifier le prix de vente d'un produit.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit."
        },
        newPrice: {
          type: "NUMBER",
          description: "Le nouveau prix en MAD."
        }
      },
      required: ["productId", "newPrice"]
    }
  },
  {
    name: "admin_create_product",
    description: "[ADMIN ONLY] Ajouter un nouveau produit au catalogue.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "Le nom officiel du produit."
        },
        description: {
          type: "STRING",
          description: "La fiche technique ou description."
        },
        brand: {
          type: "STRING",
          description: "Marque (ex: Dahua, Ruijie)."
        },
        category: {
          type: "STRING",
          description: "Catégorie (ex: Videosurveillance, Reseau, Domotique)."
        },
        subcategory: {
          type: "STRING",
          description: "Sous-catégorie."
        },
        price: {
          type: "NUMBER",
          description: "Le prix unitaire en MAD."
        },
        stock: {
          type: "INTEGER",
          description: "Stock initial (défaut: 0)."
        },
        imageUrl: {
          type: "STRING",
          description: "L'URL de l'image de présentation."
        }
      },
      required: ["name", "price"]
    }
  }
];
