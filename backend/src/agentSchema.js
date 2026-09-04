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
    description: "[ADMIN] Obtenir les statistiques financières de la boutique (chiffre d'affaires global, nombre de commandes, alertes de rupture de stock).",
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
    name: "admin_create_product",
    description: "[ADMIN] Ajouter un nouveau produit au catalogue.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "Le nom du produit."
        },
        description: {
          type: "STRING",
          description: "La fiche technique ou description."
        },
        brand: {
          type: "STRING",
          description: "Marque (ex: Dahua, Hikvision, Ruijie, Sonoff, Shelly)."
        },
        category: {
          type: "STRING",
          description: "Catégorie officielle : 'Materiel Informatique', 'Videosurveillance', 'Equipement Reseaux', 'Domotique', 'Controle Dacces et Pointeuse', 'Securite'."
        },
        subcategory: {
          type: "STRING",
          description: "Sous-catégorie exacte (ex: pour 'Materiel Informatique': 'Cartes memoire', 'HDD', 'SSDs', 'Stockage portable', 'RAM'; pour 'Videosurveillance': 'Camera IP Dahua', 'Camera IP Hikvision', 'NVR Hikvision', 'XVR Dahua'; pour 'Equipement Reseaux': 'Switch PoE', 'Armoire Informatique')."
        },
        badge: {
          type: "STRING",
          description: "Badge promo ou info (ex: 'Nouveau', 'Promo', 'Top Vente')."
        },
        price: {
          type: "NUMBER",
          description: "Le prix de vente en MAD."
        },
        stock: {
          type: "INTEGER",
          description: "Quantité en stock initiale (défaut: 0)."
        },
        imageUrl: {
          type: "STRING",
          description: "URL ou chemin de l'image (optionnel)."
        }
      },
      required: ["name", "price"]
    }
  },
  {
    name: "admin_update_product",
    description: "[ADMIN] Modifier les détails d'un produit existant (nom, prix, stock, catégorie, marque, description, badge).",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit à modifier."
        },
        name: {
          type: "STRING",
          description: "Nouveau nom."
        },
        price: {
          type: "NUMBER",
          description: "Nouveau prix en MAD."
        },
        stock: {
          type: "INTEGER",
          description: "Nouveau stock."
        },
        brand: {
          type: "STRING",
          description: "Nouvelle marque."
        },
        category: {
          type: "STRING",
          description: "Nouvelle catégorie officielle : 'Materiel Informatique', 'Videosurveillance', 'Equipement Reseaux', 'Domotique', 'Controle Dacces et Pointeuse', 'Securite'."
        },
        subcategory: {
          type: "STRING",
          description: "Nouvelle sous-catégorie exacte (ex: 'Cartes memoire', 'SSDs', 'HDD', 'Camera IP Dahua', etc.)."
        },
        description: {
          type: "STRING",
          description: "Nouvelle description."
        },
        badge: {
          type: "STRING",
          description: "Nouveau badge."
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "admin_update_product_stock",
    description: "[ADMIN] Mettre à jour spécifiquement la quantité de stock disponible d'un produit.",
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
    description: "[ADMIN] Modifier spécifiquement le prix de vente d'un produit.",
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
    name: "admin_delete_product",
    description: "[ADMIN] Supprimer définitivement un produit du catalogue par son ID ou son nom.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "INTEGER",
          description: "L'identifiant du produit à supprimer."
        },
        productName: {
          type: "STRING",
          description: "Le nom du produit si l'identifiant n'est pas fourni."
        }
      }
    }
  },
  {
    name: "admin_list_orders",
    description: "[ADMIN] Lister les commandes clients avec filtrage optionnel par statut (PENDING, DEVIS, CONFIRMED, PROCESSING, DELIVERED, COMPLETED, CANCELLED) ou recherche client.",
    parameters: {
      type: "OBJECT",
      properties: {
        status: {
          type: "STRING",
          description: "Filtrer par statut : 'PENDING', 'DEVIS', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'COMPLETED', 'CANCELLED'."
        },
        query: {
          type: "STRING",
          description: "Recherche sur le nom ou l'email du client."
        }
      }
    }
  },
  {
    name: "admin_update_order_status",
    description: "[ADMIN] Modifier le statut d'une commande client (passer en CONFIRMED, PROCESSING, DELIVERED, COMPLETED, CANCELLED).",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: {
          type: "INTEGER",
          description: "L'identifiant de la commande."
        },
        status: {
          type: "STRING",
          description: "Le nouveau statut de la commande.",
          enum: ["PENDING", "DEVIS", "CONFIRMED", "PROCESSING", "DELIVERED", "COMPLETED", "CANCELLED"]
        }
      },
      required: ["orderId", "status"]
    }
  },
  {
    name: "admin_list_quotes",
    description: "[ADMIN] Lister les devis clients émis (commandes avec statut 'DEVIS') avec filtrage optionnel.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "Recherche sur le client."
        }
      }
    }
  },
  {
    name: "admin_update_quote_status",
    description: "[ADMIN] Modifier le statut d'un devis client (statut 'DEVIS', 'CONFIRMED' pour le valider, ou 'CANCELLED' pour l'annuler).",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: {
          type: "INTEGER",
          description: "L'identifiant du devis (orderId)."
        },
        status: {
          type: "STRING",
          description: "Le nouveau statut du devis ('DEVIS', 'CONFIRMED', 'CANCELLED').",
          enum: ["DEVIS", "CONFIRMED", "CANCELLED"]
        }
      },
      required: ["orderId", "status"]
    }
  },
  {
    name: "admin_convert_quote_to_order",
    description: "[ADMIN] Valider et convertir un devis client (statut DEVIS) en commande ferme confirmée.",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: {
          type: "INTEGER",
          description: "L'identifiant du devis à convertir en commande."
        }
      },
      required: ["orderId"]
    }
  },
  {
    name: "admin_list_claims",
    description: "[ADMIN] Lister les réclamations clients (SAV) avec filtrage par statut ('PENDING', 'ACCEPTED', 'RESOLVED').",
    parameters: {
      type: "OBJECT",
      properties: {
        status: {
          type: "STRING",
          description: "Filtrer par statut : 'PENDING', 'ACCEPTED', 'RESOLVED'."
        }
      }
    }
  },
  {
    name: "admin_update_claim_status",
    description: "[ADMIN] Traiter une réclamation client en changeant son statut ('ACCEPTED' ou 'RESOLVED').",
    parameters: {
      type: "OBJECT",
      properties: {
        claimId: {
          type: "INTEGER",
          description: "L'identifiant de la réclamation."
        },
        status: {
          type: "STRING",
          description: "Nouveau statut : 'ACCEPTED' ou 'RESOLVED'.",
          enum: ["ACCEPTED", "RESOLVED", "PENDING"]
        }
      },
      required: ["claimId", "status"]
    }
  },
  {
    name: "admin_list_users",
    description: "[ADMIN] Lister les utilisateurs et clients enregistrés, avec recherche par nom, email ou filtrage par rôle ('admin', 'user').",
    parameters: {
      type: "OBJECT",
      properties: {
        role: {
          type: "STRING",
          description: "Filtrer par rôle ('admin' ou 'user')."
        },
        query: {
          type: "STRING",
          description: "Recherche par nom, email ou entreprise."
        }
      }
    }
  },
  {
    name: "admin_create_user",
    description: "[ADMIN] Créer un nouvel utilisateur ou compte client dans la base de données.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: {
          type: "STRING",
          description: "Nom complet de l'utilisateur."
        },
        email: {
          type: "STRING",
          description: "Adresse email unique."
        },
        password: {
          type: "STRING",
          description: "Mot de passe (par défaut: 'mortech123')."
        },
        phone: {
          type: "STRING",
          description: "Numéro de téléphone."
        },
        company: {
          type: "STRING",
          description: "Entreprise / Société."
        },
        role: {
          type: "STRING",
          description: "Rôle de l'utilisateur ('user' ou 'admin').",
          enum: ["user", "admin"]
        }
      },
      required: ["name", "email"]
    }
  },
  {
    name: "admin_update_user",
    description: "[ADMIN] Modifier les informations ou le rôle d'un utilisateur existant.",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: {
          type: "INTEGER",
          description: "L'identifiant de l'utilisateur."
        },
        userEmail: {
          type: "STRING",
          description: "L'email de l'utilisateur si l'ID n'est pas fourni."
        },
        name: {
          type: "STRING",
          description: "Nouveau nom."
        },
        phone: {
          type: "STRING",
          description: "Nouveau téléphone."
        },
        company: {
          type: "STRING",
          description: "Nouvelle entreprise."
        },
        role: {
          type: "STRING",
          description: "Nouveau rôle ('user' ou 'admin').",
          enum: ["user", "admin"]
        }
      }
    }
  },
  {
    name: "admin_delete_user",
    description: "[ADMIN] Supprimer définitivement un utilisateur ou client par son ID ou son email.",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: {
          type: "INTEGER",
          description: "L'identifiant de l'utilisateur à supprimer."
        },
        email: {
          type: "STRING",
          description: "L'adresse email de l'utilisateur à supprimer si l'ID n'est pas fourni."
        }
      }
    }
  }
];

export const adminToolsSchema = agentToolsSchema.filter(t => t.name.startsWith('admin_'));

